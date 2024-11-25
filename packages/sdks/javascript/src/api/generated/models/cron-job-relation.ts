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
import { ApplicationRelation } from './application-relation';
import { CronJobPattern } from './cron-job-pattern';
import { UserRelation } from './user-relation';

/**
 * 
 * @export
 * @interface CronJobRelation
 */
export interface CronJobRelation {
    /**
     * The ID of the given cron job
     * @type {number}
     * @memberof CronJobRelation
     */
    id: number;
    /**
     * The name of the cron job
     * @type {string}
     * @memberof CronJobRelation
     */
    name: string;
    /**
     * The command line to be executed when running the cron job
     * @type {string}
     * @memberof CronJobRelation
     */
    command: string;
    /**
     * The name of the Unix user on behalf of which the cron job will be executed
     * @type {string}
     * @memberof CronJobRelation
     */
    run_as_user: string;
    /**
     * A cron expression consisting of Minute, Hour, Day of Month, Month and Day of Week subexpressions
     * @type {string}
     * @memberof CronJobRelation
     */
    pattern: string;
    /**
     * 
     * @type {CronJobPattern}
     * @memberof CronJobRelation
     */
    pattern_human_readable: CronJobPattern;
    /**
     * Indicates if the cron job was auto_generated by `devopness` itself
     * @type {boolean}
     * @memberof CronJobRelation
     */
    is_auto_generated: boolean;
    /**
     * 
     * @type {ActionRelation}
     * @memberof CronJobRelation
     */
    last_action: ActionRelation | null;
    /**
     * 
     * @type {UserRelation}
     * @memberof CronJobRelation
     */
    created_by_user: UserRelation;
    /**
     * 
     * @type {ApplicationRelation}
     * @memberof CronJobRelation
     */
    application: ApplicationRelation | null;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof CronJobRelation
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof CronJobRelation
     */
    updated_at: string;
}

