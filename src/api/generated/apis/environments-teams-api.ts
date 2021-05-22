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
import { Team } from '../../generated/models';
import { TeamCreate } from '../../generated/models';
import { TeamRelation } from '../../generated/models';

/**
 * EnvironmentsTeamsApiService - Auto-generated
 */
export class EnvironmentsTeamsApiService extends ApiBaseService {
    /**
     * 
     * @summary Creates a team to the given environment
     * @param {number} environmentId The numeric environment ID
     * @param {TeamCreate} teamCreate A JSON object containing team data
     */
    public async addTeamToEnvironment(environmentId: number, teamCreate: TeamCreate): Promise<ApiResponse<Team>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'addTeamToEnvironment');
        }
        if (teamCreate === null || teamCreate === undefined) {
            throw new ArgumentNullException('teamCreate', 'addTeamToEnvironment');
        }
        
        let queryString = '';

        const requestUrl = '/environments/{environment_id}/teams' + (queryString? `?${queryString}` : '');

        const response = await this.post <Team, TeamCreate>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))), teamCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Returns a list of all teams belonging to a environment
     * @param {number} environmentId Numeric ID of the environment to get teams from
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listEnvironmentTeams(environmentId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<TeamRelation>>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'listEnvironmentTeams');
        }
        
        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/environments/{environment_id}/teams' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<TeamRelation>>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))));
        return new ApiResponse(response);
    }
}
