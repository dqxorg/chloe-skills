import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function listMarkdownFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") {
        continue;
      }
      out.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      out.push(fullPath);
    }
  }
  return out;
}

function extractLinks(content) {
  const regex = /\[[^\]]+\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }
  return links;
}

const markdownFiles = listMarkdownFiles(repoRoot);
const broken = [];

for (const filePath of markdownFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const links = extractLinks(content);
  const dir = path.dirname(filePath);

  for (const rawLink of links) {
    const clean = rawLink.split("#")[0].split("?")[0].trim();
    if (!clean) {
      continue;
    }
    if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("mailto:")) {
      continue;
    }

    const resolved = path.resolve(dir, clean);
    if (!fs.existsSync(resolved)) {
      broken.push({ file: path.relative(repoRoot, filePath), link: rawLink });
    }
  }
}

if (broken.length > 0) {
  console.error("Broken markdown links found:");
  for (const item of broken) {
    console.error(`- ${item.file} -> ${item.link}`);
  }
  process.exit(1);
}

console.log("Markdown links check passed.");
