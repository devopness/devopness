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
import { LoginCredentials } from '../../generated/models';
import { User } from '../../generated/models';
import { UserAccountResendVerification } from '../../generated/models';
import { UserAccountVerify } from '../../generated/models';
import { UserCreate } from '../../generated/models';
import { UserPasswordReset } from '../../generated/models';
import { UserPasswordSendResetLink } from '../../generated/models';
import { UserRefreshTokenCreate } from '../../generated/models';
import { UserTokens } from '../../generated/models';

/**
 * UsersApiService - Auto-generated
 */
export class UsersApiService extends ApiBaseService {
    /**
     * 
     * @summary Activate the user account
     * @param {number} userId The unique ID of the user account to activate
     * @param {string} activationHash The unique hash generated to active the account
     * @param {number} expires The time limit to expires the URL generated by the API (default &#x60;60 minutes&#x60;)
     * @param {string} signature The signature of the URL generated by the API
     */
    public async activateUser(userId: number, activationHash: string, expires: number, signature: string): Promise<ApiResponse<void>> {
        if (userId === null || userId === undefined) {
            throw new ArgumentNullException('userId', 'activateUser');
        }
        if (activationHash === null || activationHash === undefined) {
            throw new ArgumentNullException('activationHash', 'activateUser');
        }
        if (expires === null || expires === undefined) {
            throw new ArgumentNullException('expires', 'activateUser');
        }
        if (signature === null || signature === undefined) {
            throw new ArgumentNullException('signature', 'activateUser');
        }
        const queryString = [`expires=${ expires }`,`signature=${ signature }`,].join('&');
        const requestUrl = '/users/account/verify/{user_id}/{activation_hash}' + (queryString? `?${queryString}` : '');

        const response = await this.get <void>(requestUrl.replace(`{${"user_id"}}`, encodeURIComponent(String(userId))).replace(`{${"activation_hash"}}`, encodeURIComponent(String(activationHash))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Sign up/register a new user
     * @param {UserCreate} userCreate A JSON object containing user essential data
     */
    public async addUser(userCreate: UserCreate): Promise<ApiResponse<void>> {
        if (userCreate === null || userCreate === undefined) {
            throw new ArgumentNullException('userCreate', 'addUser');
        }
        const queryString = [].join('&');
        const requestUrl = '/users' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, UserCreate>(requestUrl, userCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get details of the current user
     */
    public async getCurrentUser(): Promise<ApiResponse<User>> {
        const queryString = [].join('&');
        const requestUrl = '/users/me' + (queryString? `?${queryString}` : '');

        const response = await this.get <User>(requestUrl);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get a user by ID
     * @param {number} userId Numeric ID of the user to be retrieved
     */
    public async getUser(userId: number): Promise<ApiResponse<User>> {
        if (userId === null || userId === undefined) {
            throw new ArgumentNullException('userId', 'getUser');
        }
        const queryString = [].join('&');
        const requestUrl = '/users/{user_id}' + (queryString? `?${queryString}` : '');

        const response = await this.get <User>(requestUrl.replace(`{${"user_id"}}`, encodeURIComponent(String(userId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Login/create a new token for the given credentials
     * @param {LoginCredentials} loginCredentials A JSON object containing user credentials
     */
    public async login(loginCredentials: LoginCredentials): Promise<ApiResponse<UserTokens>> {
        if (loginCredentials === null || loginCredentials === undefined) {
            throw new ArgumentNullException('loginCredentials', 'login');
        }
        const queryString = [].join('&');
        const requestUrl = '/users/login' + (queryString? `?${queryString}` : '');

        const response = await this.post <UserTokens, LoginCredentials>(requestUrl, loginCredentials);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Logout/revoke an existing token
     */
    public async logout(): Promise<ApiResponse<void>> {
        const queryString = [].join('&');
        const requestUrl = '/users/logout' + (queryString? `?${queryString}` : '');

        const response = await this.get <void>(requestUrl);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Refresh an existing user access token
     * @param {UserRefreshTokenCreate} userRefreshTokenCreate A JSON object containing user essential data
     */
    public async refreshToken(userRefreshTokenCreate: UserRefreshTokenCreate): Promise<ApiResponse<UserTokens>> {
        if (userRefreshTokenCreate === null || userRefreshTokenCreate === undefined) {
            throw new ArgumentNullException('userRefreshTokenCreate', 'refreshToken');
        }
        const queryString = [].join('&');
        const requestUrl = '/users/refresh-token' + (queryString? `?${queryString}` : '');

        const response = await this.post <UserTokens, UserRefreshTokenCreate>(requestUrl, userRefreshTokenCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Resend the verification email
     * @param {UserAccountResendVerification} userAccountResendVerification A JSON object containing the email to resend the verification link
     */
    public async resendUserVerification(userAccountResendVerification: UserAccountResendVerification): Promise<ApiResponse<void>> {
        if (userAccountResendVerification === null || userAccountResendVerification === undefined) {
            throw new ArgumentNullException('userAccountResendVerification', 'resendUserVerification');
        }
        const queryString = [].join('&');
        const requestUrl = '/users/account/resend-verification' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, UserAccountResendVerification>(requestUrl, userAccountResendVerification);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Reset the user password
     * @param {UserPasswordReset} userPasswordReset A JSON containing the new password of the user
     */
    public async resetUserPassword(userPasswordReset: UserPasswordReset): Promise<ApiResponse<object>> {
        if (userPasswordReset === null || userPasswordReset === undefined) {
            throw new ArgumentNullException('userPasswordReset', 'resetUserPassword');
        }
        const queryString = [].join('&');
        const requestUrl = '/users/password/reset' + (queryString? `?${queryString}` : '');

        const response = await this.post <object, UserPasswordReset>(requestUrl, userPasswordReset);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Send the password reset link to user\'s email
     * @param {UserPasswordSendResetLink} userPasswordSendResetLink A JSON containing the user email
     */
    public async sendUserPasswordResetLink(userPasswordSendResetLink: UserPasswordSendResetLink): Promise<ApiResponse<object>> {
        if (userPasswordSendResetLink === null || userPasswordSendResetLink === undefined) {
            throw new ArgumentNullException('userPasswordSendResetLink', 'sendUserPasswordResetLink');
        }
        const queryString = [].join('&');
        const requestUrl = '/users/password/send-reset-link' + (queryString? `?${queryString}` : '');

        const response = await this.post <object, UserPasswordSendResetLink>(requestUrl, userPasswordSendResetLink);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get the information about the activation status of the current user
     */
    public async verifyUser(): Promise<ApiResponse<UserAccountVerify>> {
        const queryString = [].join('&');
        const requestUrl = '/users/account/verify' + (queryString? `?${queryString}` : '');

        const response = await this.get <UserAccountVerify>(requestUrl);
        return new ApiResponse(response);
    }
}
