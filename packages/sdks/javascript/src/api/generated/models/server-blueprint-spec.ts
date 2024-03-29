/* eslint-disable */
/**
 * devopness API
 * Devopness API - Painless essential DevOps to everyone 
 *
 * The version of the OpenAPI document: latest
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { BlueprintService } from './blueprint-service';

/**
 * The blueprint specification
 * @export
 * @interface ServerBlueprintSpec
 */
export interface ServerBlueprintSpec {
    /**
     * The service names and their respective versions for a blueprint.
     * @type {Array<BlueprintService>}
     * @memberof ServerBlueprintSpec
     */
    services?: Array<BlueprintService>;
}

