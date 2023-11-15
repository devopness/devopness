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
import { Invitation } from '../../generated/models';
import { InvitationRelation } from '../../generated/models';
import { InvitationTeamCreate } from '../../generated/models';

/**
 * TeamsInvitationsApiService - Auto-generated
 */
export class TeamsInvitationsApiService extends ApiBaseService {
    /**
     * 
     * @summary Send invitation to user email to participate to a team
     * @param {number} teamId The ID of the team.
     * @param {InvitationTeamCreate} invitationTeamCreate A JSON object containing the resource data
     */
    public async addTeamInvitation(teamId: number, invitationTeamCreate: InvitationTeamCreate): Promise<ApiResponse<Invitation>> {
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'addTeamInvitation');
        }
        if (invitationTeamCreate === null || invitationTeamCreate === undefined) {
            throw new ArgumentNullException('invitationTeamCreate', 'addTeamInvitation');
        }
            
        let queryString = '';

        const requestUrl = '/teams/{team_id}/invitations' + (queryString? `?${queryString}` : '');

        const response = await this.post <Invitation, InvitationTeamCreate>(requestUrl.replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))), invitationTeamCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Return a list of pending invitations belonging to a team
     * @param {number} teamId The ID of the team.
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listTeamInvitations(teamId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<InvitationRelation>>> {
        if (teamId === null || teamId === undefined) {
            throw new ArgumentNullException('teamId', 'listTeamInvitations');
        }
            
        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/teams/{team_id}/invitations' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<InvitationRelation>>(requestUrl.replace(`{${"team_id"}}`, encodeURIComponent(String(teamId))));
        return new ApiResponse(response);
    }
}
