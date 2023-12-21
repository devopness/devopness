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
import { Server } from '../../generated/models';
import { ServerEnvironmentCreate } from '../../generated/models';
import { ServerRelation } from '../../generated/models';

/**
 * EnvironmentsServersApiService - Auto-generated
 */
export class EnvironmentsServersApiService extends ApiBaseService {
    /**
     * 
     * @summary Creates a server and link it to the given environment
     * @param {number} environmentId The ID of the environment.
     * @param {ServerEnvironmentCreate} serverEnvironmentCreate A JSON object containing the resource data
     */
    public async addEnvironmentServer(environmentId: number, serverEnvironmentCreate: ServerEnvironmentCreate): Promise<ApiResponse<Server>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'addEnvironmentServer');
        }
        if (serverEnvironmentCreate === null || serverEnvironmentCreate === undefined) {
            throw new ArgumentNullException('serverEnvironmentCreate', 'addEnvironmentServer');
        }

        let queryString = '';

        const requestUrl = '/environments/{environment_id}/servers' + (queryString? `?${queryString}` : '');

        const response = await this.post <Server, ServerEnvironmentCreate>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))), serverEnvironmentCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Return a list of all servers belonging to an environment
     * @param {number} environmentId The ID of the environment.
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listEnvironmentServers(environmentId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<ServerRelation>>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'listEnvironmentServers');
        }

        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/environments/{environment_id}/servers' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<ServerRelation>>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))));
        return new ApiResponse(response);
    }
}
