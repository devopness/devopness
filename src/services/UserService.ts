import { ApiBaseService } from './ApiBaseService';
import { LoginCredentials } from '../api/models/login-credentials';
import { User } from '../api/models/user';
import { UserTokens } from '../api/models/user-tokens';
import { UserCreate } from '../api/models';

export class UserService extends ApiBaseService {
    public async getById(userId?: number): Promise<User> {
        const response = await this.get<User>(`/users/${userId}`);
        return response.data;
    }

    public async getCurrentUser(): Promise<User> {
        const response = await this.get<User>(`/users/me`);
        return response.data;
    }

    public async login(credentials: LoginCredentials): Promise<UserTokens> {
        const response = await this.post<UserTokens, LoginCredentials>(`/users/login`, credentials);
        return response.data;
    }

    public async signup(newUserData: UserCreate): Promise<User> {
        const response = await this.post<User, UserCreate>(`/users/signup`, newUserData);
        return response.data;
    }

    /**
     * Log the user out, invalidating current access token
     */
    public async logout(): Promise<void> {
        const response = await this.get<void>(`/users/logout`);
        return response.data;
    }
}
