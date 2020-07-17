import JsonRefs from 'json-refs';
import YAML from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { OpenAPIV3 } from 'openapi-types';

// TODO: remove workaround once backend fixes timestamp format
function removeDateTimeFormats(yaml: any): OpenAPIV3.Document {
    console.log(`Removing all 'date-format' from schemas`)
    const doc = yaml as OpenAPIV3.Document;
    for (const key in doc.components?.schemas) {
        const schema = doc.components?.schemas[key] as OpenAPIV3.NonArraySchemaObject;
        if (schema.properties) {
            for (const propName in schema.properties) {
                const prop = schema.properties[propName] as OpenAPIV3.NonArraySchemaObject;
                if (prop['format'] == 'date-time') {
                    // @ts-ignore
                    delete doc.components?.schemas[key].properties[propName]['format'];
                }
            }
        }
    }
    return doc;
}

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

    const destYaml = removeDateTimeFormats(results.resolved);

    fs.writeFileSync(destPath, YAML.dump(destYaml));
    console.log(`Specification written at '${destPath}'`);
}

const src = './docs/spec/api-docs.yaml';
const dest = './docs/build/api-docs-output.yaml';
buildYamlSpec(src, dest);
