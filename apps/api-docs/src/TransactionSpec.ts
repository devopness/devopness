import fs from 'fs';
import YAML from 'js-yaml';
import { OpenAPIV2 } from "openapi-types";

import { Transaction, HTTPMethod as DreddHTTPMethod } from 'hooks';
import { 
    FixtureKey, isFixtureKey, 
    FixtureListKey, isFixtureListKey, resolveFixtureKey,
} from './fixtureTypes';
import FixtureStore from './FixtureStore';

const specCache: { [filename: string]: any } = {};

type LogFunction = (...any: any[]) => void;

const validHTTPMethods: { [method: string]: boolean } = {
    "get": true,
    "post": true,
    "put": true,
    "delete": true,
}
type HTTPMethod = keyof typeof validHTTPMethods

function parseHTTPMethod(method: DreddHTTPMethod): HTTPMethod | null {
    const lower = method.toLowerCase();
    return validHTTPMethods[lower] ? lower as HTTPMethod : null;
}

export default class TransactionSpec {
    slug: string;
    bodyInput: FixtureKey | FixtureListKey | null;
    pathInputs: FixtureKey[];
    output: FixtureKey | FixtureListKey | null;
    requiresAuth: boolean;
    method: HTTPMethod;
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
        const method =  parseHTTPMethod(transaction.request.method);
        if (!method) {
            throw `Unsupported request method '${transaction.request.method}' transaction '${transaction.id}'`
        }

        const operationSpec = spec.paths[resourceName][method] as OpenAPIV2.OperationObject;
        if (!operationSpec) {
            throw `Failed to get operation spec for transaction '${transaction.id}'`
        }
        const statusCode = transaction.expected.statusCode;
        const responseSpec = operationSpec.responses[statusCode];

        this.requiresAuth = this.operationSpecHasAuthorizationHeaderParam(operationSpec);
        this.method = method;
        this.slug = `${operationSpec.operationId}${statusCode}`;
        this.output = this.outputFromResponseSpec(responseSpec);
        [this.pathInputs, this.bodyInput] = this.inputsFromOperationSpec(operationSpec, spec);
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

    fixtureFromSchemaRef(schemaRef: OpenAPIV2.ReferenceObject): FixtureKey | FixtureListKey | null {
        if (schemaRef.$ref) {
            const schemaRefParts = schemaRef.$ref.split('/');
            let schemaName = schemaRefParts[schemaRefParts.length - 1];

            // SchemaName -> schema_name
            schemaName = schemaName.replace(/([A-Z])/g, (g: string) => `_${g[0].toLowerCase()}`);
            schemaName = schemaName[0] == '_' ? schemaName.substr(1) : schemaName;

            // should be a valid fixture key
            if (isFixtureKey(schemaName)) {
                return resolveFixtureKey(schemaName);
            } else if (isFixtureListKey(schemaName)) {
                return schemaName;
            } else if (!this.ignoreSchemas.includes(schemaName)) {
                this.log(`[outputFixtureKeyFromResponseSpec] '${schemaName}' is not a valid fixture key`)
            }
        } else {
            this.log(`[outputFixtureKeyFromResponseSpec] schema isn't a ref: ${JSON.stringify(schemaRef)}`)
        }
        return null;
    }

    getDefinitionFromSchemaRef(spec: OpenAPIV2.Document, schemaRef: OpenAPIV2.ReferenceObject): OpenAPIV2.SchemaObject | null {
        if (schemaRef.$ref) {
            const path = schemaRef.$ref.split('/');
            const schemaName = path[path.length - 1];
            return spec.definitions ? spec.definitions[schemaName] : null;
        }
        return null;
    }

    inputsFromOperationSpec(operationSpec: OpenAPIV2.OperationObject, spec: OpenAPIV2.Document): [FixtureKey[], FixtureKey | FixtureListKey | null] {
        const inputs: FixtureKey[] = [];
        let body: FixtureKey | FixtureListKey | null = null;
        const parametersSpec = operationSpec.parameters;

        if (parametersSpec) {
            for (const untypedParamSpec of parametersSpec) {
                let paramSpec = untypedParamSpec as OpenAPIV2.ParameterObject;
                if (paramSpec.in == 'path' && paramSpec.name.match(/[a-z_]+_id/)) {
                    const paramName = paramSpec.name.replace('_id', '');
                    if (isFixtureKey(paramName)) {
                        inputs.push(paramName);
                    } else {
                        this.log(`[inputFixtureKeysFromOperationSpec] '${paramName}' is not a valid fixture key`);
                    }
                } else if (paramSpec.in == 'body') {
                    paramSpec = paramSpec as OpenAPIV2.InBodyParameterObject;
                    const schemaRef = paramSpec.schema as OpenAPIV2.ReferenceObject;
                    const schemaDefinition = this.getDefinitionFromSchemaRef(spec, schemaRef);
                    if (schemaDefinition?.properties?.id !== undefined) {
                        body = this.fixtureFromSchemaRef(schemaRef);
                    }
                }
            }
        }
        return [inputs, body];
    }

    ignoreSchemas = ['api_error', 'log'];

    outputFromResponseSpec(responseSpec: OpenAPIV2.ResponseObject): FixtureKey | FixtureListKey | null {
        // schema['$ref'] = '#/definitions/SchemaName'
        if (responseSpec.schema) {
            const schemaRef = responseSpec.schema as OpenAPIV2.ReferenceObject;
            return this.fixtureFromSchemaRef(schemaRef);
        }
        return null;
    }
}
