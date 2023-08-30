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



/**
 * 
 * @export
 * @interface CloudProviderRelation
 */
export interface CloudProviderRelation {
    /**
     * Cloud provider code
     * @type {string}
     * @memberof CloudProviderRelation
     */
    code: string;
    /**
     * Cloud provider name
     * @type {string}
     * @memberof CloudProviderRelation
     */
    name: string;
    /**
     * Text describing what is the provider
     * @type {string}
     * @memberof CloudProviderRelation
     */
    hint: string;
    /**
     * The provider\'s logo URL.
     * @type {string}
     * @memberof CloudProviderRelation
     */
    logo_url: string;
}
