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


import { ActionData } from './action-data';
import { ActionHookRequest } from './action-hook-request';
import { ActionStatus } from './action-status';
import { ActionSummary } from './action-summary';
import { ActionTriggeredFrom } from './action-triggered-from';
import { ActionType } from './action-type';
import { EnvironmentRelation } from './environment-relation';
import { ProjectRelation } from './project-relation';
import { Resource } from './resource';
import { ServerAction } from './server-action';
import { UserRelation } from './user-relation';

/**
 * 
 * @export
 * @interface ActionRetryResponse
 */
export interface ActionRetryResponse {
    /**
     * The Id of the given action
     * @type {number}
     * @memberof ActionRetryResponse
     */
    id: number;
    /**
     * 
     * @type {ActionStatus}
     * @memberof ActionRetryResponse
     */
    status: ActionStatus;
    /**
     * 
     * @type {ActionType}
     * @memberof ActionRetryResponse
     */
    type: ActionType;
    /**
     * Human readable version of the action type
     * @type {string}
     * @memberof ActionRetryResponse
     */
    type_human_readable: string;
    /**
     * The permalink URL to the action details on Devopness web app
     * @type {string}
     * @memberof ActionRetryResponse
     */
    url_web_permalink: string;
    /**
     * 
     * @type {ActionData}
     * @memberof ActionRetryResponse
     */
    action_data: ActionData | null;
    /**
     * 
     * @type {ActionTriggeredFrom}
     * @memberof ActionRetryResponse
     */
    triggered_from: ActionTriggeredFrom;
    /**
     * 
     * @type {UserRelation}
     * @memberof ActionRetryResponse
     */
    triggered_by_user?: UserRelation;
    /**
     * 
     * @type {Resource}
     * @memberof ActionRetryResponse
     */
    resource: Resource;
    /**
     * 
     * @type {ActionSummary}
     * @memberof ActionRetryResponse
     */
    summary: ActionSummary;
    /**
     * 
     * @type {EnvironmentRelation}
     * @memberof ActionRetryResponse
     */
    environment?: EnvironmentRelation;
    /**
     * 
     * @type {ProjectRelation}
     * @memberof ActionRetryResponse
     */
    project?: ProjectRelation | null;
    /**
     * List of actions dispatched to servers
     * @type {Array<ServerAction>}
     * @memberof ActionRetryResponse
     */
    servers?: Array<ServerAction>;
    /**
     * 
     * @type {ActionHookRequest}
     * @memberof ActionRetryResponse
     */
    hook_requests?: ActionHookRequest;
    /**
     * The date and time when the action started execution (i.e., left the `pending/queued` status)
     * @type {string}
     * @memberof ActionRetryResponse
     */
    started_at: string | null;
    /**
     * The date and time when the action has finished execution
     * @type {string}
     * @memberof ActionRetryResponse
     */
    completed_at: string | null;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof ActionRetryResponse
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof ActionRetryResponse
     */
    updated_at: string;
}

