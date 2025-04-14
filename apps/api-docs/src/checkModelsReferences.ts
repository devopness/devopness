import { readdirSync, readFileSync, writeFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";

const args = process.argv;
const DEBUG_MODE = args.includes("--debug");

const MODELS_DIR = "docs/spec/auto-generated/models";
const OUTPUT_FILE = "data-models.json";
const MAX_ITERATIONS = 20;

interface ModelProperty {
  $ref?: string;
}

interface Model {
  properties?: Record<string, ModelProperty | Model>;
  items?: ModelProperty | Model;
  anyOf?: ModelProperty[] | Model[];
  oneOf?: ModelProperty[] | Model[];
}

const models: Record<string, Model> = {};

/**
 * Logs a message to the console if `DEBUG_MODE` is `true`.
 * @param {...any[]} any - The values to log.
 */
function log(level: "log" | "warn" | "error", ...any: any[]): void {
  switch (level) {
    case "log":
      console.log(...any);
      break;
    case "warn":
      console.warn(...any);
      break;
    case "error":
      console.error(...any);
      break;
  }
}

/**
 * Loads all YAML model files from a directory and parses them into model objects.
 */
function loadAllModels(): void {
  const files = readdirSync(MODELS_DIR);
  for (const file of files) {
    const filePath = join(MODELS_DIR, file);
    const fileContent = readFileSync(filePath, "utf8");

    const model = load(fileContent) as Model;
    const modelName = generateModelNameFromFilename(file);
    models[modelName] = model;
  }
}

/**
 * Converts a filename to a PascalCase model name.
 * @param filename - The name of the YAML file.
 * @returns The formatted model name.
 */
function generateModelNameFromFilename(filename: string): string {
  return filename
    .replace(".yaml", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Counts the number of `$ref` references in the given data.
 * @param data - The data to search for references.
 * @returns The number of `$ref` references.
 */
function countModelReferences(data: any): number {
  const json = JSON.stringify(data);
  return (json.match(/\$ref":/g) || []).length;
}

/**
 * Checks for circular references and exits the process if found.
 * @param ref - The current reference being resolved.
 * @param stack - The stack of references already being resolved.
 */
function throwIfCircularReferenceDetected(ref: string, stack: string[]): void {
  if (!stack.includes(ref)) return;

  log(
    "error",
    `🛑 Circular reference detected: ${stack.join(" -> ")} -> ${ref}`
  );

  process.exit(1);
}

/**
 * Recursively resolves all `$ref` in a given model.
 * @param model - The model to resolve.
 * @param stack - The stack of reference names used to detect circular references.
 * @returns The model with all `$ref` resolved.
 */
function resolveModelReferences(model: any, stack: string[] = []): any {
  if (Array.isArray(model)) {
    return model.map((item) => resolveModelReferences(item, stack));
  }

  if (model && typeof model === "object") {
    if (model.$ref) {
      const ref = model.$ref.replace("#/components/schemas/", "");
      throwIfCircularReferenceDetected(ref, stack);

      const refModel = models[ref];
      if (!refModel) {
        log("warn", `⚠️ Unknown reference: ${ref}`);
        return model;
      }

      const resolved = resolveModelReferences(
        JSON.parse(JSON.stringify(refModel)),
        [...stack, ref]
      );
      return resolved;
    }

    const result: any = {};
    for (const key of Object.keys(model)) {
      result[key] = resolveModelReferences(model[key], stack);
    }
    return result;
  }

  return model;
}

/**
 * Iteratively resolves all references in all loaded models.
 */
function resolveAllReferences(): void {
  let previousRefCount = countModelReferences(models);
  let iteration = 0;

  if (DEBUG_MODE) log("log", `🔍 Initial $ref count: ${previousRefCount}`);

  while (iteration < MAX_ITERATIONS) {
    iteration++;

    Object.keys(models).forEach((modelName) => {
      models[modelName] = resolveModelReferences(models[modelName], [
        modelName,
      ]);
    });

    const currentRefCount = countModelReferences(models);
    if (DEBUG_MODE)
      log(
        "log",
        `↻ Pass ${iteration} | Remaining $ref count: ${currentRefCount}`
      );

    if (currentRefCount === 0) break;
    if (currentRefCount >= previousRefCount) {
      log("error", "🛑 Error: model self-reference still detected or stuck");
      process.exit(1);
    }

    previousRefCount = currentRefCount;
  }
}

/**
 * Saves all resolved models to a JSON file.
 * @param outputPath - Path to save the JSON output.
 */
function saveResolvedModelsToFile(outputPath: string): void {
  writeFileSync(outputPath, JSON.stringify(models, null, 2));
  log("log", `✅ Finished writing ${outputPath}`);
}

loadAllModels();
resolveAllReferences();

if (DEBUG_MODE) {
  saveResolvedModelsToFile(OUTPUT_FILE);
}
