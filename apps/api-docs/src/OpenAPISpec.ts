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

/**
 * HTTP methods accepted by spec.
 */
const validHTTPMethods: { [method: string]: boolean } = {
    "get": true,
    "post": true,
    "put": true,
    "delete": true,
}
/**
 * Keys of the validHTTPMethods map.
 */
export type HTTPMethod = keyof typeof validHTTPMethods

/**
 * Contains methods for extracting information from OpenAPI specifications.
 * `loadYaml` needs to be called at least once before using the other methods.
 */
export default class OpenAPISpec {
    loadedFiles: Set<string>;
    document: OpenAPIV2.Document | null;
    logger: Logger;

    /** 
     * Schemas to be ignored by the parser.
     */
    ignoreSchemas = ['api_error', 'log'];


    /**
     * @param logger Logging object
     */
    constructor(logger: Logger) {
        this.loadedFiles = new Set<string>();
        this.document = null;
        this.logger = logger;
    }

    /**
     * Reads an OpenAPI YAML file and stores the parsed document.
     * @param yamlFilename Path to the YAML file
     */
    loadYaml(yamlFilename: string) {
        if (!this.loadedFiles.has(yamlFilename)) {
            this.document = YAML.load(fs.readFileSync(yamlFilename).toString()) as OpenAPIV2.Document;
        }
    }

    /**
     * Gets the specification data for an Operation.
     * @param resourceName Endpoint URL
     * @param method HTTP Method
     */
    getOperation(resourceName: string, method: HTTPMethod): OpenAPIV2.OperationObject | null {
        if (this.document) {
            return this.document.paths[resourceName][method] as OpenAPIV2.OperationObject;
        }
        return null;
    }

    /**
     * Attaches data corresponding to the fields defined in `augmentTransactionWithMetadata.ts` to a transaction object.
     * @param transaction Dredd Transaction object
     */
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

    /**
     * Validates HTTP Method strings.
     * @param method Dredd HTTP Method string
     */
    parseHTTPMethod(method: DreddHTTPMethod): HTTPMethod | null {
        const lower = method.toLowerCase();
        return validHTTPMethods[lower] ? lower as HTTPMethod : null;
    }

    /**
     * Returns whether an operation requires an authorization header
     * @param operationSpec Operation specification data
     */
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

    /**
     * Returns the FixtureKey corresponding to a Schema reference.
     * @param schemaRef Reference to a Schema
     * @param log Log function
     */
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

    /**
     * Gets Schema definition from a Schema reference.
     * @param spec 
     * @param schemaRef 
     */
    getDefinitionFromSchemaRef(spec: OpenAPIV2.Document, schemaRef: OpenAPIV2.ReferenceObject): OpenAPIV2.SchemaObject | null {
        if (schemaRef.$ref) {
            const path = schemaRef.$ref.split('/');
            const schemaName = path[path.length - 1];
            return spec.definitions ? spec.definitions[schemaName] : null;
        }
        return null;
    }

    /**
     * Identifies all inputs and dependencies to an Operation, both on both URL path and body.
     * @param operationSpec Operation specification data
     * @param log Log function
     */
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

    /**
     * Identifies the output of Operation.
     * @param operationSpec Operation specification data
     * @param log Log function
     */
    outputFromResponseSpec(responseSpec: OpenAPIV2.ResponseObject, log: LogFunction): FixtureKey | FixtureListKey | null {
        // schema['$ref'] = '#/definitions/SchemaName'
        if (responseSpec.schema) {
            const schemaRef = responseSpec.schema as OpenAPIV2.ReferenceObject;
            return this.fixtureKeyFromSchemaRef(schemaRef, attachTagToLogFunction(log, 'outputFromResponseSpec'));
        }
        return null;
    }

    /**
     * Extracts FixtureDependencies from spec Definitions and add them to the FixtureDependency map.
     */
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
