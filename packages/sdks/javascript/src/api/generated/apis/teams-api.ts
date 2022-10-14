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
import { EnvironmentTeamLink } from '../../generated/models';
import { Team } from '../../generated/models';
import { TeamUpdate } from '../../generated/models';

/**
 * TeamsApiService - Auto-generated
 */
export class TeamsApiService extends ApiBaseService {
    /**
     * 
     * @summary Delete a given team
     * @param {number} teamId Numeric ID of the team to be deleted
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
     * @param {number} teamId Numeric ID of the team to be retrieved
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
     * @summary Link team to a given environment
     * @param {number} environmentId Numeric ID of the environment to link
     * @param {number} teamId Numeric ID of the team to be linked
     * @param {EnvironmentTeamLink} environmentTeamLink A JSON object containing the role ID
     */
    public async linkTeamToEnvironment(environmentId: number, teamId: number, environmentTeamLink: EnvironmentTeamLink): Promise<ApiResponse<void>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'linkTeamToEnvironment');
        }
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'linkTeamToEnvironment');
        }
        if (environmentTeamLink === null || environmentTeamLink === undefined) {
            throw new ArgumentNullException('environmentTeamLink', 'linkTeamToEnvironment');
        }
        
        let queryString = '';

        const requestUrl = '/environments/{environment_id}/teams/{team_id}' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, EnvironmentTeamLink>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))).replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))), environmentTeamLink);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Unlink team from the environment
     * @param {number} environmentId Numeric ID of the environment to unlink
     * @param {number} teamId Numeric ID of the team to be unlinked
     */
    public async unlinkTeamFromEnvironment(environmentId: number, teamId: number): Promise<ApiResponse<void>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'unlinkTeamFromEnvironment');
        }
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'unlinkTeamFromEnvironment');
        }
        
        let queryString = '';

        const requestUrl = '/environments/{environment_id}/teams/{team_id}' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))).replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Update an existing team
     * @param {number} teamId Numeric ID of the team to be updated
     * @param {TeamUpdate} teamUpdate A JSON object containing team data
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