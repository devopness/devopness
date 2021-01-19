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
 * @interface HookRequest
 */
export interface HookRequest {
    /**
     * The unique UUID of the hook request
     * @type {string}
     * @memberof HookRequest
     */
    id: string;
    /**
     * The UUID of the hook that the request belongs to
     * @type {string}
     * @memberof HookRequest
     */
    hook_id: string;
    /**
     * The id of the action that the request belongs to
     * @type {number}
     * @memberof HookRequest
     */
    action_id: number | null;
    /**
     * The UUID of the request that this request is a retry of
     * @type {string}
     * @memberof HookRequest
     */
    retry_of: string | null;
    /**
     * The IP address of the source that triggered the hook
     * @type {string}
     * @memberof HookRequest
     */
    ip_address: string;
    /**
     * Original URL used on the request
     * @type {string}
     * @memberof HookRequest
     */
    url?: string;
    /**
     * The headers of the request
     * @type {object}
     * @memberof HookRequest
     */
    request_headers?: object | null;
    /**
     * The body of the request
     * @type {object}
     * @memberof HookRequest
     */
    request_body?: object | null;
    /**
     * The response status code
     * @type {number}
     * @memberof HookRequest
     */
    response_status_code?: number;
    /**
     * The headers of the response
     * @type {object}
     * @memberof HookRequest
     */
    response_headers?: object | null;
    /**
     * The body of the response
     * @type {object}
     * @memberof HookRequest
     */
    response_body?: object | null;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof HookRequest
     */
    created_at?: string | null;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof HookRequest
     */
    updated_at?: string | null;
}

