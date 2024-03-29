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
 * @interface SourceProviderRelation
 */
export interface SourceProviderRelation {
    /**
     * The ID of the given source provider
     * @type {number}
     * @memberof SourceProviderRelation
     */
    id: number;
    /**
     * The current user\'s ID
     * @type {number}
     * @memberof SourceProviderRelation
     */
    user_id: number;
    /**
     * 
     * @type {SourceProviderName}
     * @memberof SourceProviderRelation
     */
    provider: SourceProviderName;
    /**
     * 
     * @type {SourceProviderDisplayableName}
     * @memberof SourceProviderRelation
     */
    provider_human_readable: SourceProviderDisplayableName;
    /**
     * The nickname of the user on the Source Authentication provider
     * @type {string}
     * @memberof SourceProviderRelation
     */
    provider_user_nickname: string;
    /**
     * The date and time indicating when the authentication token will expire at
     * @type {string}
     * @memberof SourceProviderRelation
     */
    token_expires_at: string | null;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof SourceProviderRelation
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof SourceProviderRelation
     */
    updated_at: string;
}

