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
 * The provider on which a credential was issued and belongs to
 * @export
 * @interface CredentialProvider
 */
export interface CredentialProvider {
    /**
     * The provider code
     * @type {string}
     * @memberof CredentialProvider
     */
    code: string;
    /**
     * The provider name
     * @type {string}
     * @memberof CredentialProvider
     */
    name: string;
    /**
     * Descriptive text to help users to know what data is stored in the field and optional extra information on how to enter data to the field
     * @type {string}
     * @memberof CredentialProvider
     */
    hint: string;
    /**
     * Type of provider.
     * @type {string}
     * @memberof CredentialProvider
     */
    type: CredentialProviderTypeEnum;
    /**
     * Human readable version of provider type
     * @type {string}
     * @memberof CredentialProvider
     */
    type_human_readable: string;
}

/**
    * @export
    * @enum {string}
    */
export enum CredentialProviderTypeEnum {
    CloudProvider = 'cloud_provider',
    SourceProvider = 'source_provider'
}


