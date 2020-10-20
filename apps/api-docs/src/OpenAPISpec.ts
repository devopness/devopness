import { OpenAPIV2 } from "openapi-types";
import fs from 'fs';
import YAML from 'js-yaml';
import { Transaction, HTTPMethod as DreddHTTPMethod } from 'hooks';

import {
    FixtureKey, isFixtureKey,
    FixtureListKey, isFixtureListKey, FixtureDependency, fixtureDependencies, addFixtureDependency
} from './fixtureTypes';
import { camelCaseToUnderscore } from './utils';
import Logger, { attachTagToLogFunction, LogFunction } from "./Logger";

const validHTTPMethods: { [method: string]: boolean } = {
    "get": true,
    "post": true,
    "put": true,
    "delete": true,
}
export type HTTPMethod = keyof typeof validHTTPMethods

export default class OpenAPISpec {
    loadedFiles: Set<string>;
    document: OpenAPIV2.Document | null;
    logger: Logger;

    constructor(logger: Logger) {
        this.loadedFiles = new Set<string>();
        this.document = null;
        this.logger = logger;
    }

    loadYaml(yamlFilename: string) {
        if (!this.loadedFiles.has(yamlFilename)) {
            this.document = YAML.load(fs.readFileSync(yamlFilename).toString()) as OpenAPIV2.Document;
        }
    }

    getOperation(resourceName: string, method: HTTPMethod): OpenAPIV2.OperationObject | null {
        if (this.document) {
            return this.document.paths[resourceName][method] as OpenAPIV2.OperationObject;
        }
        return null;
    }

    attachTransactionMetadata(transaction: Transaction) {
        const resourceName = transaction.origin.resourceName;
        const method = this.parseHTTPMethod(transaction.request.method);
        if (!method) {
            throw `Unsupported request method '${transaction.request.method}' transaction '${transaction.id}'`
        }
        transaction.method = method;

        const operationSpec = this.getOperation(resourceName, method);
        if (!operationSpec) {
            throw `Failed to get operation spec for transaction '${transaction.id}'`
        }
        const statusCode = transaction.expected.statusCode;

        transaction.slug = `${operationSpec.operationId}${statusCode}`;
        const log = (msg: string) => this.logger.log(transaction.slug, msg);

        const responseSpec = operationSpec.responses[statusCode];

        log(`:: parsing ${transaction.slug}`);
        transaction.requiresAuth = this.operationSpecHasAuthorizationHeaderParam(operationSpec);
        transaction.output = this.outputFromResponseSpec(responseSpec, log);
        [transaction.pathInputs, transaction.pathInputDependencies, transaction.bodyInputDependencies] = this.inputsFromOperationSpec(operationSpec, log);

        // log out inputs and outputs
        const inputs = [
            ...transaction.pathInputs,
            ...Object.keys(transaction.pathInputDependencies),
            ...transaction.bodyInputDependencies.map(dep => dep.fixture)
        ];
        if (inputs.length > 0) {
            log(`[attachTransactionMetadata] inputs: ${JSON.stringify([...new Set(inputs).values()])}`);
        }
        if (transaction.output) {
            log(`[attachTransactionMetadata] output: ${JSON.stringify(transaction.output)}`);
        }
    }

    parseHTTPMethod(method: DreddHTTPMethod): HTTPMethod | null {
        const lower = method.toLowerCase();
        return validHTTPMethods[lower] ? lower as HTTPMethod : null;
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

    fixtureKeyFromSchemaRef(schemaRef: OpenAPIV2.ReferenceObject, log: LogFunction): FixtureKey | FixtureListKey | null {
        if (schemaRef.$ref) {
            const schemaRefParts = schemaRef.$ref.split('/');
            let schemaName = schemaRefParts[schemaRefParts.length - 1];

            // SchemaName -> schema_name
            schemaName = camelCaseToUnderscore(schemaName);

            if (isFixtureKey(schemaName) || isFixtureListKey(schemaName)) {
                return schemaName;
            } else if (!this.ignoreSchemas.includes(schemaName)) {
                log(`couldn't find FixtureKey '${schemaName}'`)
            }
        } else {
            log(`schema isn't a ref: ${JSON.stringify(schemaRef)}`)
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

    inputsFromOperationSpec(operationSpec: OpenAPIV2.OperationObject, log: LogFunction): [FixtureKey[], { [id: string]: FixtureDependency[] }, FixtureDependency[]] {
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
                        log(`[inputsFromOperationSpec] couldn't find FixtureKey '${paramName}'`);
                    }
                } else if (paramSpec.in == 'body') {
                    paramSpec = paramSpec as OpenAPIV2.InBodyParameterObject;
                    const schemaRef = paramSpec.schema as OpenAPIV2.ReferenceObject;
                    const bodyFixture = this.fixtureKeyFromSchemaRef(schemaRef, attachTagToLogFunction(log, '[inputsFromOperationSpec]'));
                    if (bodyFixture) {
                        const deps = fixtureDependencies(bodyFixture);
                        if (deps.length == 0) {
                            log(`[inputsFromOperationSpec] body inputs should have FixtureDependencies, got FixtureKey '${bodyFixture}'`);
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

    outputFromResponseSpec(responseSpec: OpenAPIV2.ResponseObject, log: LogFunction): FixtureKey | FixtureListKey | null {
        // schema['$ref'] = '#/definitions/SchemaName'
        if (responseSpec.schema) {
            const schemaRef = responseSpec.schema as OpenAPIV2.ReferenceObject;
            return this.fixtureKeyFromSchemaRef(schemaRef, attachTagToLogFunction(log, 'outputFromResponseSpec'));
        }
        return null;
    }

    extractFixtureDependenciesFromDefinitions() {
        if (this.document && this.document.definitions) {
            for (const name in this.document.definitions) {
                const definition = this.document.definitions[name];
                const fixtureKey = camelCaseToUnderscore(name);

                for (const prop in definition.properties) {
                    if (prop.match(/[a-z_]+_id/)) {
                        const propFixtureKey = prop.replace('_id', '');
                        if (isFixtureKey(propFixtureKey)) {
                            const dep = { path: prop, fixture: propFixtureKey, field: 'id' };
                            addFixtureDependency(fixtureKey, dep);
                            this.logger.log(fixtureKey, `found FixtureDependency: ${fixtureKey}[${prop}] = ${propFixtureKey}['id']`);
                        }
                    }
                }
            }
        }
    }

}
