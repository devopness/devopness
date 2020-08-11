/* eslint-disable */
/**
 * devopness API
 * Devopness API - Painless essential DevOps to everyone  # Authentication  <!-- ReDoc-Inject: <security-definitions> -->
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
 * @interface UserCreate
 */
export interface UserCreate {
    /**
     * The e-mail that will uniquely identify the user on the system and become its login credential
     * @type {string}
     * @memberof UserCreate
     */
    email: string;
    /**
     * User\'s full name
     * @type {string}
     * @memberof UserCreate
     */
    name: string;
    /**
     * User\'s password
     * @type {string}
     * @memberof UserCreate
     */
    password: string;
}

