import { UsersApiService } from '../api/generated/apis/users-api';
import { UsersTeamInvitationsApiService } from '../api/generated/apis/users-team-invitations-api';
import { UsersPasswordsApiService } from '../api/generated/apis/users-passwords-api';

export class UserService extends UsersApiService {
    public teamInvitations = new UsersTeamInvitationsApiService();
    public passwords = new UsersPasswordsApiService();
}
