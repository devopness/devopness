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
import { Variable } from '../../generated/models';
import { VariableRelation } from '../../generated/models';
import { VariableServiceCreate } from '../../generated/models';

/**
 * ServicesVariablesApiService - Auto-generated
 */
export class ServicesVariablesApiService extends ApiBaseService {
    /**
     * 
     * @summary Create a new variable linked to a service
     * @param {number} serviceId The ID of the service.
     * @param {VariableServiceCreate} variableServiceCreate A JSON object containing the resource data
     */
    public async addServiceVariable(serviceId: number, variableServiceCreate: VariableServiceCreate): Promise<ApiResponse<Variable>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'addServiceVariable');
        }
        if (variableServiceCreate === null || variableServiceCreate === undefined) {
            throw new ArgumentNullException('variableServiceCreate', 'addServiceVariable');
        }
            
        let queryString = '';

        const requestUrl = '/services/{service_id}/variables' + (queryString? `?${queryString}` : '');

        const response = await this.post <Variable, VariableServiceCreate>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))), variableServiceCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Return a list of variables belonging to a service
     * @param {number} serviceId The ID of the service.
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listServiceVariables(serviceId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<VariableRelation>>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'listServiceVariables');
        }
            
        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/services/{service_id}/variables' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<VariableRelation>>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))));
        return new ApiResponse(response);
    }
}
