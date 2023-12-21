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


import { CronJobPattern } from './cron-job-pattern';

/**
 * 
 * @export
 * @interface StaticCronJobFrequency
 */
export interface StaticCronJobFrequency {
    /**
     * Frequency pattern to trigger the cronjob
     * @type {string}
     * @memberof StaticCronJobFrequency
     */
    value: string;
    /**
     * 
     * @type {CronJobPattern}
     * @memberof StaticCronJobFrequency
     */
    human_readable: CronJobPattern;
    /**
     * Descriptive text to help users to know what data is stored in the field and optional extra information on how to enter data to the field
     * @type {string}
     * @memberof StaticCronJobFrequency
     */
    hint: string;
}

