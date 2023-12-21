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

import { ApiBaseService } from "../../../services/ApiBaseService";
import { ApiResponse } from "../../../common/ApiResponse";
import { ArgumentNullException } from "../../../common/Exceptions";
import { ApiError } from '../../generated/models';
import { Hook } from '../../generated/models';
import { HookTriggerResponse } from '../../generated/models';
import { HookUpdate } from '../../generated/models';

/**
 * HooksApiService - Auto-generated
 */
export class HooksApiService extends ApiBaseService {
    /**
     * 
     * @summary Delete a given hook
     * @param {string} hookId The ID of the hook.
     * @param {string} hookType The hook type.
     */
    public async deleteHook(hookId: string, hookType: string): Promise<ApiResponse<void>> {
        if (hookId === null || hookId === undefined) {
            throw new ArgumentNullException('hookId', 'deleteHook');
        }
        if (hookType === null || hookType === undefined) {
            throw new ArgumentNullException('hookType', 'deleteHook');
        }

        let queryString = '';

        const requestUrl = '/hooks/{hook_type}/{hook_id}' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"hook_id"}}`, encodeURIComponent(String(hookId))).replace(`{${"hook_type"}}`, encodeURIComponent(String(hookType))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get a hook by ID
     * @param {string} hookId The ID of the hook.
     * @param {string} hookType The hook type.
     */
    public async getHook(hookId: string, hookType: string): Promise<ApiResponse<Hook>> {
        if (hookId === null || hookId === undefined) {
            throw new ArgumentNullException('hookId', 'getHook');
        }
        if (hookType === null || hookType === undefined) {
            throw new ArgumentNullException('hookType', 'getHook');
        }

        let queryString = '';

        const requestUrl = '/hooks/{hook_type}/{hook_id}' + (queryString? `?${queryString}` : '');

        const response = await this.get <Hook>(requestUrl.replace(`{${"hook_id"}}`, encodeURIComponent(String(hookId))).replace(`{${"hook_type"}}`, encodeURIComponent(String(hookType))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Trigger an incoming hook associated action
     * @param {string} hookId The ID of the hook.
     */
    public async triggerHook(hookId: string): Promise<ApiResponse<HookTriggerResponse>> {
        if (hookId === null || hookId === undefined) {
            throw new ArgumentNullException('hookId', 'triggerHook');
        }

        let queryString = '';

        const requestUrl = '/hooks/{hook_id}/trigger' + (queryString? `?${queryString}` : '');

        const response = await this.post <HookTriggerResponse>(requestUrl.replace(`{${"hook_id"}}`, encodeURIComponent(String(hookId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Update an existing hook
     * @param {string} hookId The ID of the hook.
     * @param {string} hookType The hook type.
     * @param {HookUpdate} hookUpdate A JSON object containing the resource data
     */
    public async updateHook(hookId: string, hookType: string, hookUpdate: HookUpdate): Promise<ApiResponse<void>> {
        if (hookId === null || hookId === undefined) {
            throw new ArgumentNullException('hookId', 'updateHook');
        }
        if (hookType === null || hookType === undefined) {
            throw new ArgumentNullException('hookType', 'updateHook');
        }
        if (hookUpdate === null || hookUpdate === undefined) {
            throw new ArgumentNullException('hookUpdate', 'updateHook');
        }

        let queryString = '';

        const requestUrl = '/hooks/{hook_type}/{hook_id}' + (queryString? `?${queryString}` : '');

        const response = await this.put <void, HookUpdate>(requestUrl.replace(`{${"hook_id"}}`, encodeURIComponent(String(hookId))).replace(`{${"hook_type"}}`, encodeURIComponent(String(hookType))), hookUpdate);
        return new ApiResponse(response);
    }
}
