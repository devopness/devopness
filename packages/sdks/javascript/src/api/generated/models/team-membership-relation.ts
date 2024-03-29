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


import { RoleRelation } from './role-relation';

/**
 * 
 * @export
 * @interface TeamMembershipRelation
 */
export interface TeamMembershipRelation {
    /**
     * The unique ID of the given team
     * @type {number}
     * @memberof TeamMembershipRelation
     */
    id: number;
    /**
     * The name of the given team
     * @type {string}
     * @memberof TeamMembershipRelation
     */
    name: string;
    /**
     * The URL to team\'s image
     * @type {string}
     * @memberof TeamMembershipRelation
     */
    photo_url: string;
    /**
     * 
     * @type {RoleRelation}
     * @memberof TeamMembershipRelation
     */
    role: RoleRelation | null;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof TeamMembershipRelation
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof TeamMembershipRelation
     */
    updated_at: string;
}

