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


import { ServiceInitialState } from './service-initial-state';
import { ServiceType } from './service-type';

/**
 * 
 * @export
 * @interface ServiceEnvironmentCreate
 */
export interface ServiceEnvironmentCreate {
    /**
     * Tells if the service should start automatically on operating system boot.
     * @type {boolean}
     * @memberof ServiceEnvironmentCreate
     */
    auto_start?: boolean;
    /**
     * 
     * @type {ServiceInitialState}
     * @memberof ServiceEnvironmentCreate
     */
    initial_state?: ServiceInitialState;
    /**
     * 
     * @type {ServiceType}
     * @memberof ServiceEnvironmentCreate
     */
    type: ServiceType;
    /**
     * The service version to be installed. Must be one of <code></code> Must be at least 3 characters. Must not be greater than 30 characters.
     * @type {string}
     * @memberof ServiceEnvironmentCreate
     */
    version: string;
    /**
     * List of valid resource IDs
     * @type {Array<number>}
     * @memberof ServiceEnvironmentCreate
     */
    servers?: Array<number>;
}

