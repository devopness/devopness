import fs from 'fs';
import YAML from 'js-yaml';
import { OpenAPIV2 } from "openapi-types";

import { Transaction } from 'hooks';
import { FixtureKey, isFixtureKey } from './fixtureTypes';

const specCache: { [filename: string]: any } = {};

type LogFunction = (...any: any[]) => void;

export default class TransactionSpec {
    slug: string;
    inputs: FixtureKey[];
    output: FixtureKey | null;
    requiresAuth: boolean;
    isDelete: boolean;
    log: LogFunction;

    readSpecFile(path: string): any {
        if (!(path in specCache)) {
            specCache[path] = YAML.load(fs.readFileSync(path).toString());
        }
        return specCache[path];
    }

    constructor(transaction: Transaction, log: LogFunction) {
        this.log = log;

        const spec = this.readSpecFile(transaction.origin.filename) as OpenAPIV2.Document;

        const resourceName = transaction.origin.resourceName;
        const method =  transaction.request.method.toLowerCase();
        const operationSpec = spec.paths[resourceName][method] as OpenAPIV2.OperationObject;
        if (!operationSpec) {
            throw `Failed to get operation spec for transaction '${transaction.id}'`
        }
        const statusCode = transaction.expected.statusCode;
        const responseSpec = operationSpec.responses[statusCode];

        this.requiresAuth = this.operationSpecHasAuthorizationHeaderParam(operationSpec);
        this.isDelete = method === 'delete';
        this.slug = `${operationSpec.operationId}${statusCode}`;
        this.inputs = this.inputFixtureKeysFromOperationSpec(operationSpec);
        this.output = this.outputFixtureKeyFromResponseSpec(responseSpec);
    }

    operationSpecHasAuthorizationHeaderParam(operationSpec: OpenAPIV2.OperationObject): boolean {
        const parametersSpec = operationSpec.parameters;
        if (parametersSpec) {
            for (const untypedParamSpec of parametersSpec) {
                const paramSpec = untypedParamSpec as OpenAPIV2.ParameterObject;
                if (paramSpec.in == 'header' && paramSpec.name == 'Authorization') {
                    return true
                }
            }
        }
        return false;
    }

    inputFixtureKeysFromOperationSpec(operationSpec: OpenAPIV2.OperationObject): FixtureKey[] {
        let inputs: FixtureKey[] = [];
        const parametersSpec = operationSpec.parameters;
        if (parametersSpec) {
            for (const untypedParamSpec of parametersSpec) {
                const paramSpec = untypedParamSpec as OpenAPIV2.ParameterObject;
                if (paramSpec.in == 'path' && paramSpec.name.match(/[a-z_]+_id/)) {
                    const paramName = paramSpec.name.replace('_id', '');
                    if (isFixtureKey(paramName)) {
                        inputs.push(paramName);
                    } else {
                        this.log(`[inputFixtureKeysFromOperationSpec] '${paramName}' is not a valid fixture key`);
                    }
                }
            }
        }
        return inputs;
    }

    outputFixtureKeyFromResponseSpec(responseSpec: OpenAPIV2.ResponseObject): FixtureKey | null {
        // schema['$ref'] = '#/definitions/SchemaName'
        if (responseSpec.schema) {
            const schemaRef = responseSpec.schema as OpenAPIV2.ReferenceObject;
            if (schemaRef.$ref) {
                const schemaRefParts = schemaRef.$ref.split('/');
                let schemaName = schemaRefParts[schemaRefParts.length - 1];

                // SchemaName -> schema_name
                schemaName = schemaName.replace(/([A-Z])/g, (g: string) => `_${g[0].toLowerCase()}`);
                schemaName = schemaName[0] == '_' ? schemaName.substr(1) : schemaName;

                // should be a valid fixture key
                if (isFixtureKey(schemaName)) {
                    return schemaName;
                } else if (schemaName != 'error') {
                    this.log(`[outputFixtureKeyFromResponseSpec] '${schemaName}' is not a valid fixture key`)
                }
            } else {
                this.log(`[outputFixtureKeyFromResponseSpec] schema isn't a ref: ${JSON.stringify(schemaRef)}`)
            }
        }
        return null;
    }
}
