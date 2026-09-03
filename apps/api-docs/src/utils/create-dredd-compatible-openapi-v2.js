const path = require('path');
const shell = require('shelljs');
const YAML = require('js-yaml');

const fileWithDescriptions = path.join(__dirname, "./../../docs/build/api-docs-output-v2.yaml")
const fileWithoutDescriptions = path.join(__dirname, "./../../docs/build/api-docs-output-v2-without-descriptions.yaml")

// ensure old output file is removed
shell.rm('-rf', fileWithoutDescriptions);

// TODO: Once Dredd can reliably consume OpenAPI v3 for this repo, remove this
// workaround and run it directly against the v3 document.
function removeDeepObjectFilterParameters(input) {
  const document = YAML.load(input);

  const isUnsupportedFilterParameter = (parameter) => {
    if (!parameter || parameter.in !== 'query' || parameter.name !== 'filter') {
      return false;
    }

    if (parameter.type === 'object') {
      return true;
    }

    return Boolean(
      parameter.schema &&
        (parameter.schema.type === 'object' ||
          (parameter.schema.$ref && parameter.schema.$ref.endsWith('FilterParameter')))
    );
  };

  const pruneParameters = (node) => {
    if (Array.isArray(node)) {
      return node.map(pruneParameters);
    }

    if (node && typeof node === 'object') {
      for (const key of Object.keys(node)) {
        const value = node[key];

        if (key === 'parameters' && Array.isArray(value)) {
          node[key] = value.filter((parameter) => !isUnsupportedFilterParameter(parameter));
          continue;
        }

        node[key] = pruneParameters(value);
      }
    }

    return node;
  };

  return YAML.dump(pruneParameters(document), {
    lineWidth: -1,
  });
}

// `shelljs sed` could be used here, but the below fails as it seems to not
// support multiline/newline
// shell.cp('-R', fileWithDescriptions, fileWithoutDescriptions);
// shell.sed(/description:\n.*\$ref: (>-\n|\s*).*\.\.\/spec\/descriptions\/.*\.md/g, '', fileWithoutDescriptions);

// using native `replace` instead
var input = shell.cat(fileWithDescriptions);
var output = removeDeepObjectFilterParameters(
  input.replace(/description:\n.*\$ref: (>-\n|\s*).*\.\.\/spec\/descriptions\/.*\.md/g, '')
);
shell.ShellString(output).to(fileWithoutDescriptions);
