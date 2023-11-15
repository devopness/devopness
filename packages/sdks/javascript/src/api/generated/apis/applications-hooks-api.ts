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
import { HookRelation } from '../../generated/models';

/**
 * ApplicationsHooksApiService - Auto-generated
 */
export class ApplicationsHooksApiService extends ApiBaseService {
    /**
     * 
     * @summary List all hooks in an application
     * @param {number} applicationId The ID of the application.
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listApplicationHooks(applicationId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<HookRelation>>> {
        if (applicationId === null || applicationId === undefined) {
            throw new ArgumentNullException('applicationId', 'listApplicationHooks');
        }
            
        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/applications/{application_id}/hooks' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<HookRelation>>(requestUrl.replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId))));
        return new ApiResponse(response);
    }
}
