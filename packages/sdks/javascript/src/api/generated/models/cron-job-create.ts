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


import { EnvironmentLinkItem } from './environment-link-item';

/**
 * 
 * @export
 * @interface CronJobCreate
 */
export interface CronJobCreate {
    /**
     * A cron expression consisting of Minute, Hour, Day of Month, Month and Day of Week subexpressions.
     * @type {string}
     * @memberof CronJobCreate
     */
    pattern: string;
    /**
     * The name of the cron job. Must not be greater than 60 characters.
     * @type {string}
     * @memberof CronJobCreate
     */
    name: string;
    /**
     * The command line to be executed when running the cron job. Must be at least 5 characters. Must not be greater than 255 characters.
     * @type {string}
     * @memberof CronJobCreate
     */
    command: string;
    /**
     * The name of the system user on behalf of which the cron job will be executed. Must not be greater than 60 characters.
     * @type {string}
     * @memberof CronJobCreate
     */
    run_as_user: string;
    /**
     * Numeric ID of the application to which the cron job belongs to.
     * @type {number}
     * @memberof CronJobCreate
     */
    application_id?: number;
    /**
     * Numeric ID of the project to which the cron job belongs to.
     * @type {number}
     * @memberof CronJobCreate
     */
    project_id: number;
    /**
     * 
     * @type {Array<EnvironmentLinkItem>}
     * @memberof CronJobCreate
     */
    environments?: Array<EnvironmentLinkItem>;
}

