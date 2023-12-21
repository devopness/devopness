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


import { ServiceType } from './service-type';
import { StaticServiceTypeSupportedVersions } from './static-service-type-supported-versions';

/**
 * 
 * @export
 * @interface StaticServiceType
 */
export interface StaticServiceType {
    /**
     * 
     * @type {ServiceType}
     * @memberof StaticServiceType
     */
    value: ServiceType;
    /**
     * Displayable version of the service name
     * @type {string}
     * @memberof StaticServiceType
     */
    human_readable: string;
    /**
     * Descriptive text to help users to know what data is stored in the field and optional extra information on how to enter data to the field
     * @type {string}
     * @memberof StaticServiceType
     */
    hint: string;
    /**
     * List of service versions supported by Devopness
     * @type {Array<StaticServiceTypeSupportedVersions>}
     * @memberof StaticServiceType
     */
    supported_versions: Array<StaticServiceTypeSupportedVersions>;
}

