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
import { TeamUpdate } from '../../generated/models';

/**
 * TeamsApiService - Auto-generated
 */
export class TeamsApiService extends ApiBaseService {
    /**
     * 
     * @summary Delete a given team
     * @param {number} teamId The ID of the team.
     */
    public async deleteTeam(teamId: number): Promise<ApiResponse<void>> {
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'deleteTeam');
        }

        let queryString = '';

        const requestUrl = '/teams/{team_id}' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get a team by ID
     * @param {number} teamId The ID of the team.
     */
    public async getTeam(teamId: number): Promise<ApiResponse<Team>> {
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'getTeam');
        }

        let queryString = '';

        const requestUrl = '/teams/{team_id}' + (queryString? `?${queryString}` : '');

        const response = await this.get <Team>(requestUrl.replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Update an existing team
     * @param {number} teamId The ID of the team.
     * @param {TeamUpdate} teamUpdate A JSON object containing the resource data
     */
    public async updateTeam(teamId: number, teamUpdate: TeamUpdate): Promise<ApiResponse<void>> {
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'updateTeam');
        }
        if (teamUpdate === null || teamUpdate === undefined) {
            throw new ArgumentNullException('teamUpdate', 'updateTeam');
        }

        let queryString = '';

        const requestUrl = '/teams/{team_id}' + (queryString? `?${queryString}` : '');

        const response = await this.put <void, TeamUpdate>(requestUrl.replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))), teamUpdate);
        return new ApiResponse(response);
    }
}
