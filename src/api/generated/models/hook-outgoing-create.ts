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


import { ActionType } from './action-type';
import { HookOutgoingTriggerWhenCondition } from './hook-outgoing-trigger-when-condition';
import { ResourceType } from './resource-type';

/**
 * 
 * @export
 * @interface HookOutgoingCreate
 */
export interface HookOutgoingCreate {
    /**
     * The name to uniquely identify the outgoing hook
     * @type {string}
     * @memberof HookOutgoingCreate
     */
    name: string;
    /**
     * 
     * @type {ActionType}
     * @memberof HookOutgoingCreate
     */
    action_type: ActionType;
    /**
     * Determines if the hook is current active
     * @type {boolean}
     * @memberof HookOutgoingCreate
     */
    active?: boolean;
    /**
     * 
     * @type {ResourceType}
     * @memberof HookOutgoingCreate
     */
    resource_type: ResourceType;
    /**
     * The id of the resource that the outgoing hook belongs to
     * @type {number}
     * @memberof HookOutgoingCreate
     */
    resource_id: number;
    /**
     * The URL that Devopness should send a request when the outgoing hook is triggered
     * @type {string}
     * @memberof HookOutgoingCreate
     */
    target_url: string;
    /**
     * Conditions that must be met to trigger the hook.
     * @type {Array<HookOutgoingTriggerWhenCondition>}
     * @memberof HookOutgoingCreate
     */
    trigger_when: Array<HookOutgoingTriggerWhenCondition>;
}

