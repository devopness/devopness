const path = require('path');
const shell = require('shelljs');

const fileWithDescriptions = path.join(__dirname, "./../../docs/build/api-docs-output-v2.yaml")
const fileWithoutDescriptions = path.join(__dirname, "./../../docs/build/api-docs-output-v2-without-descriptions.yaml")

// ensure old output file is removed
shell.rm('-rf', fileWithoutDescriptions);

// `shelljs sed` could be used here, but the below fails as it seems to not
// support multiline/newline
// shell.cp('-R', fileWithDescriptions, fileWithoutDescriptions);
// shell.sed(/description:\n.*\$ref: (>-\n|\s*).*\.\.\/spec\/descriptions\/.*\.md/g, '', fileWithoutDescriptions);

// using native `replace` instead
var input = shell.cat(fileWithDescriptions);
var output = input.replace(/description:\n.*\$ref: (>-\n|\s*).*\.\.\/spec\/descriptions\/.*\.md/g, '');
shell.ShellString(output).to(fileWithoutDescriptions);
