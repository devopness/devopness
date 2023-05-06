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
import { TeamEnvironmentLink } from '../../generated/models';

/**
 * EnvironmentsTeamsApiService - Auto-generated
 */
export class EnvironmentsTeamsApiService extends ApiBaseService {
    /**
     * 
     * @summary Link team to a given environment
     * @param {number} environmentId The ID of the environment.
     * @param {number} teamId The ID of the team.
     * @param {TeamEnvironmentLink} teamEnvironmentLink A JSON object containing the resource data
     */
    public async linkTeamToEnvironment(environmentId: number, teamId: number, teamEnvironmentLink: TeamEnvironmentLink): Promise<ApiResponse<void>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'linkTeamToEnvironment');
        }
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'linkTeamToEnvironment');
        }
        if (teamEnvironmentLink === null || teamEnvironmentLink === undefined) {
            throw new ArgumentNullException('teamEnvironmentLink', 'linkTeamToEnvironment');
        }
        
        let queryString = '';

        const requestUrl = '/environments/{environment_id}/teams/{team_id}/link' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, TeamEnvironmentLink>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))).replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))), teamEnvironmentLink);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Unlink team from the environment
     * @param {number} environmentId The ID of the environment.
     * @param {number} teamId The ID of the team.
     */
    public async unlinkTeamFromEnvironment(environmentId: number, teamId: number): Promise<ApiResponse<void>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'unlinkTeamFromEnvironment');
        }
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'unlinkTeamFromEnvironment');
        }
        
        let queryString = '';

        const requestUrl = '/environments/{environment_id}/teams/{team_id}/unlink' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))).replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))));
        return new ApiResponse(response);
    }
}