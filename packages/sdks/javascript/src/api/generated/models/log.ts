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


import { ActionTargetData } from './action-target-data';
import { ActionTargetLogStep } from './action-target-log-step';

/**
 * 
 * @export
 * @interface Log
 */
export interface Log {
    /**
     * 
     * @type {ActionTargetData}
     * @memberof Log
     */
    target: ActionTargetData | null;
    /**
     * 
     * @type {ActionTargetLogStep}
     * @memberof Log
     */
    step: ActionTargetLogStep | null;
    /**
     * The date and time when the requested log record was last updated
     * @type {string}
     * @memberof Log
     */
    updated_at: string | null;
}

