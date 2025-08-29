import { readdirSync, readFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";

// Constants for file paths
const ENDPOINTS_DIR = "docs/spec/auto-generated/endpoints";
const API_DOCS_FILE = "docs/spec/api-docs.yaml";

// Interfaces for type safety
interface APIDocs {
  tags: { name: string }[];
  "x-tagGroups": { name: string; tags: string[] }[];
}

interface EndpointDefinition {
  tags?: string[];
}

/**
 * Parses a YAML file and returns its content as a specified type.
 * @param filePath - Path to the YAML file.
 * @returns Parsed YAML content.
 */
const parseYamlFile = <T>(filePath: string): T => {
  const fileContent = readFileSync(filePath, "utf8");
  return load(fileContent) as T;
};

/**
 * Extracts all unique tags from endpoint YAML files in a directory.
 * @param directoryPath - Path to the directory containing endpoint YAML files.
 * @returns A Set of unique tags.
 */
const extractTagsFromEndpoints = (directoryPath: string): Set<string> => {
  const files = readdirSync(directoryPath);
  const tags = new Set<string>();

  // Loop through each file in the directory
  for (const file of files) {
    const endpointPath = join(directoryPath, file);
    const endpointDefinition = parseYamlFile<EndpointDefinition>(endpointPath);

    // Add each tag from the endpoint definition to the set
    if (endpointDefinition.tags) {
      for (const tag of endpointDefinition.tags) {
        tags.add(tag);
      }
    }
  }

  return tags;
};

/**
 * Extracts declared tags from the API documentation.
 * @param apiDocs - The parsed API documentation object.
 * @returns A Set of declared tags.
 */
const extractDeclaredTags = (apiDocs: APIDocs): Set<string> => {
  const declaredTags = new Set<string>();

  // Loop through each tag in the API documentation
  for (const tag of apiDocs.tags) {
    declaredTags.add(tag.name);
  }

  return declaredTags;
};

/**
 * Extracts grouped tags from the API documentation.
 * @param apiDocs - The parsed API documentation object.
 * @returns A Set of grouped tags.
 */
const extractGroupedTags = (apiDocs: APIDocs): Set<string> => {
  const groupedTags = new Set<string>();

  // Loop through each tag group in the API documentation
  for (const group of apiDocs["x-tagGroups"]) {
    for (const tag of group.tags) {
      groupedTags.add(tag);
    }
  }

  return groupedTags;
};

/**
 * Finds missing tags by comparing endpoint tags with declared and grouped tags.
 * @param endpointTags - Tags extracted from endpoint files.
 * @param declaredTags - Tags declared in the API documentation.
 * @param groupedTags - Tags grouped in the API documentation.
 * @returns An object containing missing tags and missing groups.
 */
const findMissingTags = (
  endpointTags: Set<string>,
  declaredTags: Set<string>,
  groupedTags: Set<string>
) => {
  const missingTags: string[] = [];
  const missingGroups: string[] = [];

  // Check each tag in the endpoint tags
  for (const tag of endpointTags) {
    if (!declaredTags.has(tag)) {
      missingTags.push(tag);
    }
    if (!groupedTags.has(tag)) {
      missingGroups.push(tag);
    }
  }

  return { missingTags, missingGroups };
};

/**
 * Finds unused tags that are declared but not used in endpoints.
 * @param declaredTags - Tags declared in the API documentation.
 * @param endpointTags - Tags extracted from endpoint files.
 * @returns A Set of unused tags.
 */
const findUnusedTags = (
  declaredTags: Set<string>,
  endpointTags: Set<string>
): Set<string> => {
  const allowedTags = new Set(["API Reference", "API Tokens"]);
  const unusedTags = new Set<string>();

  // Check each declared tag
  for (const tag of declaredTags) {
    if (!endpointTags.has(tag) && !allowedTags.has(tag)) {
      unusedTags.add(tag);
    }
  }

  return unusedTags;
};

/**
 * Reports issues to the console if any exist.
 * @param issues - An object containing a label and items to report.
 * @returns True if issues exist, otherwise false.
 */
const reportIssues = (issues: { label: string; items: string[] }): boolean => {
  if (issues.items.length > 0) {
    console.log(`\n⚠️ ${issues.items.length} ${issues.label}:`);

    // Sort and print each issue
    const sortedItems = [...issues.items].sort();
    for (const item of sortedItems) {
      console.log(`- ${item}`);
    }

    return true;
  }

  return false;
};

/**
 * Checks the usage of tags in the API documentation and endpoint files.
 * Throws an error if any issues are found.
 */
const checkTagsUsage = (): void => {
  // Step 1: Extract tags from endpoints and API documentation
  const endpointTags = extractTagsFromEndpoints(ENDPOINTS_DIR);
  const apiDocs = parseYamlFile<APIDocs>(API_DOCS_FILE);
  const declaredTags = extractDeclaredTags(apiDocs);
  const groupedTags = extractGroupedTags(apiDocs);

  // Step 2: Find missing and unused tags
  const { missingTags, missingGroups } = findMissingTags(
    endpointTags,
    declaredTags,
    groupedTags
  );
  const unusedTags = findUnusedTags(declaredTags, endpointTags);

  // Step 3: Report issues
  let hasErrors = false;

  if (
    reportIssues({
      label: "Missing tags in 'api-docs.tags'",
      items: missingTags,
    })
  ) {
    hasErrors = true;
  }

  if (
    reportIssues({
      label: "Missing tags in 'api-docs.x-tagGroups'",
      items: missingGroups,
    })
  ) {
    hasErrors = true;
  }

  if (
    reportIssues({
      label: "Extra tags in 'api-docs'",
      items: [...unusedTags],
    })
  ) {
    hasErrors = true;
  }

  // Step 4: Throw an error if any issues were found
  if (hasErrors) {
    throw new Error("Tags usage check failed");
  }
};

// Run the tag usage check
checkTagsUsage();
