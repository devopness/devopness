const JsonRefs = require('json-refs');
const YAML = require('js-yaml');
const fs = require('fs');
const path = require('path');

async function buildYamlSpec(srcPath, destPath) {
    const srcYaml = YAML.load(fs.readFileSync(srcPath).toString());
    const options = {
        loaderOptions: {
            processContent: function(res, callback) {
                callback(YAML.safeLoad(res.text));
            }
        },
        location: srcPath
    };
    const results = await JsonRefs.resolveRefs(srcYaml, options);

    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }
    fs.writeFileSync(destPath, YAML.dump(results.resolved));
    console.log(`Specification written at '${destPath}'`);
}

const src = './spec/api-docs.yaml';
const dest = './build/api-docs-output.yaml';
buildYamlSpec(src, dest);
