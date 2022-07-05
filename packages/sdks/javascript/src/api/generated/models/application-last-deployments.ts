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


import { Action } from './action';

/**
 * Latest deployment created to application and the more recent completed deployment
 * @export
 * @interface ApplicationLastDeployments
 */
export interface ApplicationLastDeployments {
    /**
     * 
     * @type {Action}
     * @memberof ApplicationLastDeployments
     */
    latest?: Action | null;
    /**
     * 
     * @type {Action}
     * @memberof ApplicationLastDeployments
     */
    live?: Action | null;
}

