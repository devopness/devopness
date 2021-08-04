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
 * @interface CredentialCreate
 */
export interface CredentialCreate {
    /**
     * The provider that this credential belongs to
     * @type {string}
     * @memberof CredentialCreate
     */
    provider_name: string;
    /**
     * The name of the credential
     * @type {string}
     * @memberof CredentialCreate
     */
    name: string;
    /**
     * The key used to authenticate on cloud provider
     * @type {string}
     * @memberof CredentialCreate
     */
    key: string;
    /**
     * The secret used on AWS providers
     * @type {string}
     * @memberof CredentialCreate
     */
    secret?: string;
}

