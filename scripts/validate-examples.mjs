import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function readYaml(p) {
  return yaml.load(fs.readFileSync(p, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const requestSchema = readJson(path.join(repoRoot, "schemas", "agent-request.schema.json"));
const responseSchema = readJson(path.join(repoRoot, "schemas", "agent-response.schema.json"));
const request = readJson(path.join(repoRoot, "examples", "request.sample.json"));
const response = readJson(path.join(repoRoot, "examples", "response.sample.json"));

const skills = readYaml(path.join(repoRoot, "data", "skills-matrix.yaml"));
const learning = readYaml(path.join(repoRoot, "data", "learning-paths.yaml"));
const roadmap = readYaml(path.join(repoRoot, "data", "roadmap-links.yaml"));
const rubrics = readYaml(path.join(repoRoot, "data", "role-rubrics.yaml"));

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const validateRequest = ajv.compile(requestSchema);
const validateResponse = ajv.compile(responseSchema);

assert(validateRequest(request), `Request sample invalid: ${JSON.stringify(validateRequest.errors)}`);
assert(validateResponse(response), `Response sample invalid: ${JSON.stringify(validateResponse.errors)}`);

const role = request.target_role;
assert(skills.roles?.[role], `Role ${role} missing in skills-matrix`);
assert(learning.paths?.[role], `Role ${role} missing in learning-paths`);
assert(roadmap.roles?.[role], `Role ${role} missing in roadmap-links`);
assert(rubrics.rubrics?.[role], `Role ${role} missing in role-rubrics`);

console.log("Example validation passed.");
