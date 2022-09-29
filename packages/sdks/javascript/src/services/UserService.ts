import { UsersApiService } from '../api/generated/apis/users-api';
import { UsersTeamsApiService } from '../api/generated/apis/users-teams-api';

export class UserService extends UsersApiService {
    public teams = new UsersTeamsApiService();
}
