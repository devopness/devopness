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
import { Application } from '../../generated/models';
import { ApplicationEnvironmentCreate } from '../../generated/models';
import { ApplicationRelation } from '../../generated/models';

/**
 * EnvironmentsApplicationsApiService - Auto-generated
 */
export class EnvironmentsApplicationsApiService extends ApiBaseService {
    /**
     * 
     * @summary Create a new application
     * @param {number} environmentId The ID of the environment.
     * @param {ApplicationEnvironmentCreate} applicationEnvironmentCreate A JSON object containing the resource data
     */
    public async addEnvironmentApplication(environmentId: number, applicationEnvironmentCreate: ApplicationEnvironmentCreate): Promise<ApiResponse<Application>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'addEnvironmentApplication');
        }
        if (applicationEnvironmentCreate === null || applicationEnvironmentCreate === undefined) {
            throw new ArgumentNullException('applicationEnvironmentCreate', 'addEnvironmentApplication');
        }
        
        let queryString = '';

        const requestUrl = '/environments/{environment_id}/applications' + (queryString? `?${queryString}` : '');

        const response = await this.post <Application, ApplicationEnvironmentCreate>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))), applicationEnvironmentCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Return a list of all Applications belonging to an environment
     * @param {number} environmentId The ID of the environment.
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listEnvironmentApplications(environmentId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<ApplicationRelation>>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'listEnvironmentApplications');
        }
        
        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/environments/{environment_id}/applications' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<ApplicationRelation>>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))));
        return new ApiResponse(response);
    }
}