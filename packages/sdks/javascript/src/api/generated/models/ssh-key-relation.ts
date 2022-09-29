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


import { ActionRelation } from './action-relation';

/**
 * 
 * @export
 * @interface SshKeyRelation
 */
export interface SshKeyRelation {
    /**
     * The Id of the given SSH public key
     * @type {number}
     * @memberof SshKeyRelation
     */
    id: number;
    /**
     * The Id of the user to which the SSH key belongs to
     * @type {number}
     * @memberof SshKeyRelation
     */
    created_by: number;
    /**
     * The project id that the SSH public key belongs to
     * @type {number}
     * @memberof SshKeyRelation
     */
    project_id: number;
    /**
     * The name entered by the user to uniquely identify the public SSH key
     * @type {string}
     * @memberof SshKeyRelation
     */
    name: string;
    /**
     * The hashed fingerprint of the public key
     * @type {string}
     * @memberof SshKeyRelation
     */
    fingerprint: string;
    /**
     * 
     * @type {ActionRelation}
     * @memberof SshKeyRelation
     */
    last_action: ActionRelation | null;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof SshKeyRelation
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof SshKeyRelation
     */
    updated_at: string;
}

