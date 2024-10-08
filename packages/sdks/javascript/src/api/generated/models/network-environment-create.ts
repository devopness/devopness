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


import { NetworkProvisionInput } from './network-provision-input';

/**
 * 
 * @export
 * @interface NetworkEnvironmentCreate
 */
export interface NetworkEnvironmentCreate {
    /**
     * The network\'s name. Must not be one of <code>default</code> Must be between 1 and 63 characters.
     * @type {string}
     * @memberof NetworkEnvironmentCreate
     */
    name: string;
    /**
     * 
     * @type {NetworkProvisionInput}
     * @memberof NetworkEnvironmentCreate
     */
    provision_input: NetworkProvisionInput;
    /**
     * The ID of the cloud credential.
     * @type {number}
     * @memberof NetworkEnvironmentCreate
     */
    credential_id: number;
}

