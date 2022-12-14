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
import { Service } from '../../generated/models';
import { ServiceEnvironmentCreate } from '../../generated/models';
import { ServiceRelation } from '../../generated/models';

/**
 * EnvironmentsServicesApiService - Auto-generated
 */
export class EnvironmentsServicesApiService extends ApiBaseService {
    /**
     * 
     * @summary Add a Service to the given environment
     * @param {number} environmentId The ID of the environment.
     * @param {ServiceEnvironmentCreate} serviceEnvironmentCreate A JSON object containing the resource data
     */
    public async addEnvironmentService(environmentId: number, serviceEnvironmentCreate: ServiceEnvironmentCreate): Promise<ApiResponse<Service>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'addEnvironmentService');
        }
        if (serviceEnvironmentCreate === null || serviceEnvironmentCreate === undefined) {
            throw new ArgumentNullException('serviceEnvironmentCreate', 'addEnvironmentService');
        }
        
        let queryString = '';

        const requestUrl = '/environments/{environment_id}/services' + (queryString? `?${queryString}` : '');

        const response = await this.post <Service, ServiceEnvironmentCreate>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))), serviceEnvironmentCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Return a list of all services belonging to a environment
     * @param {number} environmentId The ID of the environment.
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listEnvironmentServices(environmentId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<ServiceRelation>>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'listEnvironmentServices');
        }
        
        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/environments/{environment_id}/services' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<ServiceRelation>>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))));
        return new ApiResponse(response);
    }
}
