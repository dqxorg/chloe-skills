import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key.startsWith("--") && value && !value.startsWith("--")) {
      args[key.slice(2)] = value;
      i += 1;
    }
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readYaml(filePath) {
  return yaml.load(fs.readFileSync(filePath, "utf8"));
}

function fail(message, detail) {
  const payload = { ok: false, message, detail };
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
}

function validateWithSchema(ajv, schema, data, label) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    fail(`${label} validation failed`, validate.errors);
  }
}

function ensureRoleExistsInAll(roleKey, datasets) {
  const missing = [];
  for (const [label, content] of Object.entries(datasets)) {
    const bucket = content.roles || content.paths || content.rubrics;
    if (!bucket || !Object.prototype.hasOwnProperty.call(bucket, roleKey)) {
      missing.push(label);
    }
  }
  if (missing.length > 0) {
    fail("Role key missing from required datasets", { roleKey, missing });
  }
}

function policyCheck(response) {
  const errors = [];

  if ((response.top_priorities || []).length > 5) {
    errors.push("top_priorities must not exceed 5 items");
  }

  if ((response.risks_and_mitigations || []).length > 3) {
    errors.push("risks_and_mitigations must not exceed 3 items");
  }

  if ((response.metrics_and_targets || []).length < 3) {
    errors.push("metrics_and_targets must include at least 3 metrics");
  }

  const confidence = response.confidence_and_assumptions?.confidence;
  if (!["high", "medium", "low"].includes(confidence)) {
    errors.push("confidence must be one of: high, medium, low");
  }

  const evidence = response.evidence_required || [];
  if (evidence.length === 0) {
    errors.push("evidence_required must include at least one artifact");
  }

  if (errors.length > 0) {
    fail("Policy checks failed", errors);
  }
}

function resolveRepoRoot() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, "..");
}

function main() {
  const args = parseArgs(process.argv);
  const repoRoot = resolveRepoRoot();

  const requestPath = path.resolve(repoRoot, args.request || "examples/request.sample.json");
  const responsePath = path.resolve(repoRoot, args.response || "examples/response.sample.json");

  const requestSchema = readJson(path.resolve(repoRoot, "schemas/agent-request.schema.json"));
  const responseSchema = readJson(path.resolve(repoRoot, "schemas/agent-response.schema.json"));
  const request = readJson(requestPath);
  const response = readJson(responsePath);

  const skills = readYaml(path.resolve(repoRoot, "data/skills-matrix.yaml"));
  const learning = readYaml(path.resolve(repoRoot, "data/learning-paths.yaml"));
  const roadmap = readYaml(path.resolve(repoRoot, "data/roadmap-links.yaml"));
  const rubrics = readYaml(path.resolve(repoRoot, "data/role-rubrics.yaml"));

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  validateWithSchema(ajv, requestSchema, request, "Request");
  validateWithSchema(ajv, responseSchema, response, "Response");
  ensureRoleExistsInAll(request.target_role, {
    "skills-matrix": skills,
    "learning-paths": learning,
    "roadmap-links": roadmap,
    "role-rubrics": rubrics
  });
  policyCheck(response);

  console.log(
    JSON.stringify(
      {
        ok: true,
        message: "All checks passed",
        validated: {
          request: requestPath,
          response: responsePath,
          role: request.target_role
        }
      },
      null,
      2
    )
  );
}

main();
