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
 * @interface TeamProjectCreate
 */
export interface TeamProjectCreate {
    /**
     * The name of the team. Must not be greater than 255 characters.
     * @type {string}
     * @memberof TeamProjectCreate
     */
    name: string;
    /**
     * The URL to team\'s image. Must be a valid URL.
     * @type {string}
     * @memberof TeamProjectCreate
     */
    photo_url?: string;
}

