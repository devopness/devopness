import { TeamsApiService } from '../api/generated/apis/teams-api';
import { TeamsInvitationsApiService } from '../api/generated/apis/teams-invitations-api';
import { TeamsMembersApiService } from '../api/generated/apis/teams-members-api';
import { TeamsMembershipsApiService } from '../api/generated/apis/teams-memberships-api';

export class TeamService extends TeamsApiService {
    public invitations = new TeamsInvitationsApiService();
    public members = new TeamsMembersApiService();
    public memberships = new TeamsMembershipsApiService();
}
