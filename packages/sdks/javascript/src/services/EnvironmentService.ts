import { EnvironmentsActionsApiService } from '../api/generated/apis/environments-actions-api';
import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsTeamMembershipsApiService } from '../api/generated/apis/environments-team-memberships-api';
import { EnvironmentsTeamsApiService } from '../api/generated/apis/environments-teams-api';

export class EnvironmentService extends EnvironmentsApiService {
    public actions = new EnvironmentsActionsApiService();
    public teams = new EnvironmentsTeamsApiService();
    public teamMemberships = new EnvironmentsTeamMembershipsApiService();
}
