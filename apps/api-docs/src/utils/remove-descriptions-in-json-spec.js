const fs = require("fs");
const path = require("path");

const fileName = "spec.json";
const filePath = path.join(__dirname, "./../../docs/build/", fileName);

let input = "";
try {
  input = fs.readFileSync(filePath, "utf8");
} catch (error) {
  console.error(
    "ERROR:",
    "File `" + fileName + "` not found in `docs/build` folder.",
    "Please run `npm run api-build-spec` and `npm run api-convert-spec-to-json`, then try again."
  );
  process.exit(1);
}

// The `description` field needs to be removed because the tool generating the spec.json
// assigns an object value `{ "$ref": "../spec/descriptions/resource.md" }` to `description`,
// while the tool converting spec.json to the final SDK requires `description` to be a string.
//
// Removing `description` does not impact the final SDK as the field is currently unused
// due to this type incompatibility.
const output = input.replace(/\n[\s]*"description": {\n.*"\n[\s]*},/gim, "");

try {
  fs.writeFileSync(filePath, output);
  console.log("Successfully removed descriptions from `" + fileName + "`");
} catch (error) {
  console.error(error);
}
