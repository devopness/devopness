import { ApiBaseService } from './ApiBaseService';
import { LoginCredentials } from '../api/models/login-credentials';
import { User } from '../api/models/user';
import { UserTokens } from '../api/models/user-tokens';

// to do: find a more generic way to expose data without exposing AxiosResponse type
import { AxiosResponse } from "axios";

export class UserService extends ApiBaseService {
    /**
     * @todo services should not need to reference Axios, leave only base service dependant upon it
     * or is it better to provide client app access to Axios interface for flexibility?
     * @todo: return data or return a promise? It seems a promise gives more flexibility
     * for inspecting and debugging on the client app side of things. But ..., really needed?
     */
    public getById(userId?: number): Promise<AxiosResponse<User>> {
        return this.get<User>(`/users/${userId}`);
    }

    public getCurrentUser(): Promise<AxiosResponse<User>> {
        return this.get<User>(`/users/me`);
    }

    public login(credentials: LoginCredentials): Promise<AxiosResponse<UserTokens>> {
        return this.post<UserTokens, LoginCredentials>(`/users/login`, credentials);
    }
}
