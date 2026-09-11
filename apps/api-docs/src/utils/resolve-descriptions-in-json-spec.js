// Build the OpenAPI JSON file with inline description text.
//
// The shared API Spec stores description fields as file refs so the source
// tree stays maintainable. The docs app cannot render those refs directly, so
// this script resolves them into plain strings before `docs/openapi.json` is
// published. Without this step, the docs site would show broken or missing
// descriptions wherever the spec points to markdown files.

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

/**
 * Read every description file under the docs tree.
 *
 * We scan recursively because the spec can grow new nested folders later and
 * we do not want to update this script every time the tree changes.
 */
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

/**
 * Detect the exact shape used for description references.
 *
 * We only replace plain `{ "$ref": "..." }` values. Anything else is kept as
 * is so unrelated JSON fields are never rewritten by mistake.
 */
function isDescriptionRef(value) {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.$ref === "string" &&
    Object.keys(value).length === 1
  );
}

/**
 * Resolve one description reference into plain text.
 *
 * We try the exact path first, then the file name, and finally the resolved
 * file path. That order keeps the lookup stable when the generated spec uses
 * different relative paths for the same description file.
 */
function resolveDescription(ref, descriptionByPath, descriptionByName) {
  // The JSON spec may point to a path relative to the generated spec file, not
  // just to the descriptions folder, so we normalize it before matching.
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

/**
 * Walk the whole JSON tree and inline every description reference.
 *
 * The OpenAPI file is deeply nested, so a shallow pass would miss items
 * inside paths, responses, schemas, and arrays.
 */
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

/**
 * Read the source spec and write the docs-only OpenAPI JSON output.
 *
 * The workflow uses this as a copy step, so we always create the target file
 * from the resolved source instead of mutating the input by accident.
 */
function main() {
  // Keep this tool flexible so the workflow can reuse it for both the docs app
  // output and any future copies that need the same inline description text.
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
