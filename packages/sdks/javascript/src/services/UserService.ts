import { UsersApiService } from '../api/generated/apis/users-api';
import { UsersTeamInvitationsApiService } from '../api/generated/apis/users-team-invitations-api';

export class UserService extends UsersApiService {
    public teamInvitations = new UsersTeamInvitationsApiService();
}
