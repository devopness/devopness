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
import { HookIncomingCreate } from '../../generated/models';
import { HookIncomingUpdate } from '../../generated/models';

/**
 * HooksIncomingApiService - Auto-generated
 */
export class HooksIncomingApiService extends ApiBaseService {
    /**
     * 
     * @summary Create an incoming hook to a specific resource
     * @param {HookIncomingCreate} hookIncomingCreate A JSON object containing incoming hook data
     */
    public async addIncomingHook(hookIncomingCreate: HookIncomingCreate): Promise<ApiResponse<Hook>> {
        if (hookIncomingCreate === null || hookIncomingCreate === undefined) {
            throw new ArgumentNullException('hookIncomingCreate', 'addIncomingHook');
        }
        
        let queryString = '';

        const requestUrl = '/hooks/incoming' + (queryString? `?${queryString}` : '');

        const response = await this.post <Hook, HookIncomingCreate>(requestUrl, hookIncomingCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Delete a given incoming hook
     * @param {string} hookId Unique ID of the incoming hook to be deleted
     */
    public async deleteIncomingHook(hookId: string): Promise<ApiResponse<void>> {
        if (hookId === null || hookId === undefined) {
            throw new ArgumentNullException('hookId', 'deleteIncomingHook');
        }
        
        let queryString = '';

        const requestUrl = '/hooks/incoming/{hook_id}' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"hook_id"}}`, encodeURIComponent(String(hookId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get an incoming hook by Id
     * @param {string} hookId Unique ID of the hook to be retrieved
     */
    public async getIncomingHook(hookId: string): Promise<ApiResponse<Hook>> {
        if (hookId === null || hookId === undefined) {
            throw new ArgumentNullException('hookId', 'getIncomingHook');
        }
        
        let queryString = '';

        const requestUrl = '/hooks/incoming/{hook_id}' + (queryString? `?${queryString}` : '');

        const response = await this.get <Hook>(requestUrl.replace(`{${"hook_id"}}`, encodeURIComponent(String(hookId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Trigger an incoming hook associated action
     * @param {string} hookId Unique ID of the hook to be triggered
     * @param {object} [body] A JSON object containg hook variables
     */
    public async triggerHook(hookId: string, body?: object): Promise<ApiResponse<void>> {
        if (hookId === null || hookId === undefined) {
            throw new ArgumentNullException('hookId', 'triggerHook');
        }
        
        let queryString = '';

        const requestUrl = '/hooks/incoming/{hook_id}' + (queryString? `?${queryString}` : '');

        const response = await this.post <void>(requestUrl.replace(`{${"hook_id"}}`, encodeURIComponent(String(hookId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Update an existing incoming hook
     * @param {string} hookId Unique ID of the hook to be updated
     * @param {HookIncomingUpdate} hookIncomingUpdate A JSON object containing incoming hook data
     */
    public async updateIncomingHook(hookId: string, hookIncomingUpdate: HookIncomingUpdate): Promise<ApiResponse<void>> {
        if (hookId === null || hookId === undefined) {
            throw new ArgumentNullException('hookId', 'updateIncomingHook');
        }
        if (hookIncomingUpdate === null || hookIncomingUpdate === undefined) {
            throw new ArgumentNullException('hookIncomingUpdate', 'updateIncomingHook');
        }
        
        let queryString = '';

        const requestUrl = '/hooks/incoming/{hook_id}' + (queryString? `?${queryString}` : '');

        const response = await this.put <void, HookIncomingUpdate>(requestUrl.replace(`{${"hook_id"}}`, encodeURIComponent(String(hookId))), hookIncomingUpdate);
        return new ApiResponse(response);
    }
}
