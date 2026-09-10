const fs = require("fs");
const path = require("path");

const inputFilePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, "./../../docs/build/spec.json");
const outputFilePath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(__dirname, "./../../docs/build/openapi.json");
const descriptionsDir = path.join(__dirname, "./../../docs/spec/descriptions");
const inputFileName = path.basename(inputFilePath);

// Inline description refs from the source tree into the docs JSON output.
function readDescriptionFiles(dir, descriptionByPath, descriptionByName) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      readDescriptionFiles(entryPath, descriptionByPath, descriptionByName);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const relativePath = path
      .relative(descriptionsDir, entryPath)
      .split(path.sep)
      .join("/");
    const content = fs.readFileSync(entryPath, "utf8");

    descriptionByPath.set(relativePath, content);
    descriptionByName.set(path.basename(entryPath), content);
  }
}

function isDescriptionRef(value) {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.$ref === "string" &&
    Object.keys(value).length === 1
  );
}

function resolveDescription(ref, descriptionByPath, descriptionByName) {
  const absoluteRefPath = path.normalize(path.join(path.dirname(inputFilePath), ref));
  const relativeRefPath = path
    .relative(descriptionsDir, absoluteRefPath)
    .split(path.sep)
    .join("/");
  const fileName = path.basename(absoluteRefPath);

  if (descriptionByPath.has(relativeRefPath)) {
    return descriptionByPath.get(relativeRefPath);
  }

  if (descriptionByName.has(fileName)) {
    return descriptionByName.get(fileName);
  }

  if (fs.existsSync(absoluteRefPath)) {
    return fs.readFileSync(absoluteRefPath, "utf8");
  }

  throw new Error(`Failed to resolve description reference: ${ref}`);
}

function inlineDescriptions(node, descriptionByPath, descriptionByName) {
  if (Array.isArray(node)) {
    return node.map((item) => inlineDescriptions(item, descriptionByPath, descriptionByName));
  }

  if (!node || typeof node !== "object") {
    return node;
  }

  const resolvedNode = {};

  for (const [key, value] of Object.entries(node)) {
    if (key === "description" && isDescriptionRef(value)) {
      resolvedNode[key] = resolveDescription(value.$ref, descriptionByPath, descriptionByName);
      continue;
    }

    resolvedNode[key] = inlineDescriptions(value, descriptionByPath, descriptionByName);
  }

  return resolvedNode;
}

function main() {
  const input = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));
  const descriptionByPath = new Map();
  const descriptionByName = new Map();

  readDescriptionFiles(descriptionsDir, descriptionByPath, descriptionByName);

  const output = inlineDescriptions(input, descriptionByPath, descriptionByName);
  const outputJson = `${JSON.stringify(output, null, 2)}\n`;

  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFileSync(outputFilePath, outputJson);

  console.log(`Specification written at '${outputFilePath}'`);
}

main();
