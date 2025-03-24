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


import { EnvironmentType } from './environment-type';
import { ProjectRelation } from './project-relation';
import { ResourceSummaryItem } from './resource-summary-item';

/**
 * 
 * @export
 * @interface ArchivedEnvironmentRelation
 */
export interface ArchivedEnvironmentRelation {
    /**
     * Unique id of the given record
     * @type {number}
     * @memberof ArchivedEnvironmentRelation
     */
    id: number;
    /**
     * 
     * @type {EnvironmentType}
     * @memberof ArchivedEnvironmentRelation
     */
    type: EnvironmentType;
    /**
     * The human readable version of the type
     * @type {string}
     * @memberof ArchivedEnvironmentRelation
     */
    type_human_readable: string;
    /**
     * Environment\'s name
     * @type {string}
     * @memberof ArchivedEnvironmentRelation
     */
    name: string;
    /**
     * Environment\'s description
     * @type {string}
     * @memberof ArchivedEnvironmentRelation
     */
    description: string | null;
    /**
     * Number of credits used in the current monthly billing cycle by actions of resources in the environment.
     * @type {number}
     * @memberof ArchivedEnvironmentRelation
     */
    used_credits?: number;
    /**
     * Summary of the resource
     * @type {Array<ResourceSummaryItem>}
     * @memberof ArchivedEnvironmentRelation
     */
    resource_summary?: Array<ResourceSummaryItem>;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof ArchivedEnvironmentRelation
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof ArchivedEnvironmentRelation
     */
    updated_at: string;
    /**
     * The date and time when the record was archived
     * @type {string}
     * @memberof ArchivedEnvironmentRelation
     */
    archived_at: string | null;
    /**
     * 
     * @type {ProjectRelation}
     * @memberof ArchivedEnvironmentRelation
     */
    project: ProjectRelation | null;
}

