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
import { CloudProviderOptionsRelation } from '../../generated/models';

/**
 * StaticDataCloudProviderOptionsApiService - Auto-generated
 */
export class StaticDataCloudProviderOptionsApiService extends ApiBaseService {
    /**
     * 
     * @summary List `Cloud Provider` service options
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listStaticCloudProviderOptions(page?: number, perPage?: number): Promise<ApiResponse<Array<CloudProviderOptionsRelation>>> {

        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/static/cloud-provider-options' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<CloudProviderOptionsRelation>>(requestUrl);
        return new ApiResponse(response);
    }
}
