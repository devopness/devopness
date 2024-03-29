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


import { SourceProviderDisplayableName } from './source-provider-displayable-name';
import { SourceProviderName } from './source-provider-name';

/**
 * 
 * @export
 * @interface SourceProviderOptionsRelation
 */
export interface SourceProviderOptionsRelation {
    /**
     * 
     * @type {SourceProviderName}
     * @memberof SourceProviderOptionsRelation
     */
    provider_name: SourceProviderName;
    /**
     * 
     * @type {SourceProviderDisplayableName}
     * @memberof SourceProviderOptionsRelation
     */
    provider_name_human_readable: SourceProviderDisplayableName;
    /**
     * URL of the connection
     * @type {string}
     * @memberof SourceProviderOptionsRelation
     */
    connect_url: string;
}

