import JsonRefs from 'json-refs';
import YAML from 'js-yaml';
import fs from 'fs';
import path from 'path';

async function buildYamlSpec(srcPath: string, destPath: string) {
    const srcYaml = YAML.load(fs.readFileSync(srcPath).toString());
    const options = {
        loaderOptions: {
            processContent: (res: { text: string }, callback: Function) => {
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

const src = './docs/spec/api-docs.yaml';
const dest = './docs/build/api-docs-output.yaml';
buildYamlSpec(src, dest);
