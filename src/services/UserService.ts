import { ApiBaseService } from './ApiBaseService';
import { LoginCredentials } from '../api/models/login-credentials';
import { User } from '../api/models/user';
import { UserTokens } from '../api/models/user-tokens';
import { UserCreate } from '../api/models';
import { ArgumentNullException } from '../common/Exceptions';

export class UserService extends ApiBaseService {
    public async getById(userId?: number): Promise<User> {
        const response = await this.get<User>(`/users/${userId}`);
        return response.data;
    }

    public async getCurrentUser(): Promise<User> {
        const response = await this.get<User>(`/users/me`);
        return response.data;
    }

    public async login(loginCredentials: LoginCredentials): Promise<UserTokens> {
        /**
         * @todo: example on README must show how to catch the required param exceptions like this one
         * @todo: Error currently not being caught on a promisse `catch` simple example
         */
        if (loginCredentials === null || loginCredentials === undefined) {
            throw new ArgumentNullException('loginCredentials', 'usersLoginPost');
        }
        const response = await this.post <UserTokens, LoginCredentials>(`/users/login`, loginCredentials);
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
