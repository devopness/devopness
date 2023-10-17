import { UsersApiService } from '../api/generated/apis/users-api';
import { UsersTeamInvitationsApiService } from '../api/generated/apis/users-team-invitations-api';
import { UsersPasswordsApiService } from '../api/generated/apis/users-passwords-api';
import { UsersEnvironmentsApiService } from '../api/generated/apis/users-environments-api';

export class UserService extends UsersApiService {
    public environments = new UsersEnvironmentsApiService();
    public passwords = new UsersPasswordsApiService();
    public teamInvitations = new UsersTeamInvitationsApiService();
}
