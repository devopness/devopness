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
 * @interface PasswordUserReset
 */
export interface PasswordUserReset {
    /**
     * The unique token generated by the API and sent to the user\'s e-mail address when the send-reset-link operation has been triggered.
     * @type {string}
     * @memberof PasswordUserReset
     */
    token: string;
    /**
     * The email of the user to reset the password.
     * @type {string}
     * @memberof PasswordUserReset
     */
    email: string;
    /**
     * The new password to define to user account.
     * @type {string}
     * @memberof PasswordUserReset
     */
    password: string;
    /**
     * The new password again.
     * @type {string}
     * @memberof PasswordUserReset
     */
    password_confirmation: string;
}

