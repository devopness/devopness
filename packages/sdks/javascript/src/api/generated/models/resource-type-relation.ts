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


import { ResourceOperation } from './resource-operation';

/**
 * 
 * @export
 * @interface ResourceTypeRelation
 */
export interface ResourceTypeRelation {
    /**
     * The type of resource this resourceType affects
     * @type {string}
     * @memberof ResourceTypeRelation
     */
    resource_type: string;
    /**
     * Human readable resource name
     * @type {string}
     * @memberof ResourceTypeRelation
     */
    resource_type_human_readable: string;
    /**
     * Human readable plural resource name
     * @type {string}
     * @memberof ResourceTypeRelation
     */
    resource_type_human_readable_plural: string;
    /**
     * A list of resource operations
     * @type {Array<ResourceOperation>}
     * @memberof ResourceTypeRelation
     */
    supported_operations: Array<ResourceOperation>;
}

