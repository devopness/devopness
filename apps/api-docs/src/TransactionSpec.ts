import fs from 'fs';
import YAML from 'js-yaml';
import { OpenAPIV2 } from "openapi-types";

import { Transaction, HTTPMethod as DreddHTTPMethod } from 'hooks';
import {
    FixtureKey, isFixtureKey,
    FixtureListKey, isFixtureListKey, FixtureDependency, fixtureDependencies,
} from './fixtureTypes';
import Logger from './Logger';

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
    bodyInputDependencies: FixtureDependency[];
    pathInputs: FixtureKey[];
    pathInputDependencies: { [id: string]: FixtureDependency[] };
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

    constructor(transaction: Transaction, logger: Logger) {
        const spec = this.readSpecFile(transaction.origin.filename) as OpenAPIV2.Document;

        const resourceName = transaction.origin.resourceName;
        const method = parseHTTPMethod(transaction.request.method);
        if (!method) {
            throw `Unsupported request method '${transaction.request.method}' transaction '${transaction.id}'`
        }

        const operationSpec = spec.paths[resourceName][method] as OpenAPIV2.OperationObject;
        if (!operationSpec) {
            throw `Failed to get operation spec for transaction '${transaction.id}'`
        }
        const statusCode = transaction.expected.statusCode;

        this.slug = `${operationSpec.operationId}${statusCode}`;
        this.log = (msg: string) => logger.log(this.slug, msg);

        const responseSpec = operationSpec.responses[statusCode];

        this.log(`:: parsing ${this.slug}`);
        this.requiresAuth = this.operationSpecHasAuthorizationHeaderParam(operationSpec);
        this.method = method;
        this.output = this.outputFromResponseSpec(responseSpec);
        [this.pathInputs, this.pathInputDependencies, this.bodyInputDependencies] = this.inputsFromOperationSpec(operationSpec);

        // log out inputs and outputs
        const inputs = [
            ...this.pathInputs,
            ...Object.keys(this.pathInputDependencies),
            ...this.bodyInputDependencies.map(dep => dep.fixture)
        ];
        if (inputs.length > 0) {
            this.log(`[TransactionSpec] inputs: ${JSON.stringify([...new Set(inputs).values()])}`);
        }
        if (this.output) {
            this.log(`[TransactionSpec] output: ${JSON.stringify(this.output)}`);
        }
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

    fixtureKeyFromSchemaRef(schemaRef: OpenAPIV2.ReferenceObject, logTag: string): FixtureKey | FixtureListKey | null {
        if (schemaRef.$ref) {
            const schemaRefParts = schemaRef.$ref.split('/');
            let schemaName = schemaRefParts[schemaRefParts.length - 1];

            // SchemaName -> schema_name
            schemaName = schemaName.replace(/([A-Z])/g, (g: string) => `_${g[0].toLowerCase()}`);
            schemaName = schemaName[0] == '_' ? schemaName.substr(1) : schemaName;


            if (isFixtureKey(schemaName) || isFixtureListKey(schemaName)) {
                return schemaName;
            } else if (!this.ignoreSchemas.includes(schemaName)) {
                this.log(`[${logTag}] couldn't find FixtureKey '${schemaName}'`)
            }
        } else {
            this.log(`[${logTag}] schema isn't a ref: ${JSON.stringify(schemaRef)}`)
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

    inputsFromOperationSpec(operationSpec: OpenAPIV2.OperationObject): [FixtureKey[], { [id: string]: FixtureDependency[] }, FixtureDependency[]] {
        const inputs: FixtureKey[] = [];
        let inputDeps: { [id: string]: FixtureDependency[] } = {};
        let bodyDeps: FixtureDependency[] = [];
        const parametersSpec = operationSpec.parameters;

        if (parametersSpec) {
            for (const untypedParamSpec of parametersSpec) {
                let paramSpec = untypedParamSpec as OpenAPIV2.ParameterObject;
                if (paramSpec.in == 'path' && paramSpec.name.match(/[a-z_]+_id/)) {
                    const paramName = paramSpec.name.replace('_id', '');
                    if (isFixtureKey(paramName)) {
                        const deps = fixtureDependencies(paramName);
                        if (deps.length > 0) {
                            inputDeps[paramName] = deps;
                        } else {
                            inputs.push(paramName);
                        }
                    } else {
                        this.log(`[inputsFromOperationSpec] couldn't find FixtureKey '${paramName}'`);
                    }
                } else if (paramSpec.in == 'body') {
                    paramSpec = paramSpec as OpenAPIV2.InBodyParameterObject;
                    const schemaRef = paramSpec.schema as OpenAPIV2.ReferenceObject;
                    const bodyFixture = this.fixtureKeyFromSchemaRef(schemaRef, 'inputsFromOperationSpec');
                    if (bodyFixture) {
                        const deps = fixtureDependencies(bodyFixture);
                        if (deps.length == 0) {
                            this.log(`[inputsFromOperationSpec] body inputs should have FixtureDependencies, got FixtureKey '${bodyFixture}'`);
                        } else {
                            bodyDeps = deps;
                        }
                    }
                }
            }
        }
        return [inputs, inputDeps, bodyDeps];
    }

    ignoreSchemas = ['api_error', 'log'];

    outputFromResponseSpec(responseSpec: OpenAPIV2.ResponseObject): FixtureKey | FixtureListKey | null {
        // schema['$ref'] = '#/definitions/SchemaName'
        if (responseSpec.schema) {
            const schemaRef = responseSpec.schema as OpenAPIV2.ReferenceObject;
            return this.fixtureKeyFromSchemaRef(schemaRef, 'outputFromResponseSpec');
        }
        return null;
    }
}
