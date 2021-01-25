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
 * @interface HookRequestRelation
 */
export interface HookRequestRelation {
    /**
     * The unique UUID of the hook request
     * @type {string}
     * @memberof HookRequestRelation
     */
    id: string;
    /**
     * The UUID of the hook that the request belongs to
     * @type {string}
     * @memberof HookRequestRelation
     */
    hook_id: string;
    /**
     * The id of the action that the request belongs to
     * @type {number}
     * @memberof HookRequestRelation
     */
    action_id: number | null;
    /**
     * The UUID of the request that this request is a retry of
     * @type {string}
     * @memberof HookRequestRelation
     */
    retry_of: string | null;
    /**
     * The IP address of the source that triggered the hook
     * @type {string}
     * @memberof HookRequestRelation
     */
    ip_address: string;
    /**
     * Original URL used on the request
     * @type {string}
     * @memberof HookRequestRelation
     */
    url?: string;
    /**
     * The response status code
     * @type {number}
     * @memberof HookRequestRelation
     */
    response_status_code?: number;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof HookRequestRelation
     */
    created_at?: string | null;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof HookRequestRelation
     */
    updated_at?: string | null;
}

