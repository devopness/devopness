import { ApiBaseService } from './ApiBaseService';

/**
 * This helper service should be able to handle all API auth types and make authentication
 * transparent for the other API services:
 * 1) user credential based (email/password): default
 * 2) Machine to Machine oauth2 client_credentials grant_type
 * 3) API_KEY based auth
 * 4) API_KEY + access_token (useful to act on behalf of another user)
 */
export class AuthService extends ApiBaseService {
    private STORAGE_KEY_ACCESS_TOKEN = 'devopness-api::access_token';
    private STORAGE_KEY_REFRESH_TOKEN = 'devopness-api::refresh_token';

    /**
     * @todo: Local storage or HTTP cookies? What's safer? Check 2020 best practices
     * @todo: more over: should this package manage token storage? Or is it up to
     * the consumer app to keep the token (or not)? If storing ourselves, how to
     * ensure we store it safely and with compatibility with node.js, browser
     * and mobile? It seems simpler to leave it to the client app
     */
    /**
     * @todo: make a decision about who should be responsible for storing access tokens
     * if the package itself must handle that, then:
     * 1) Add `"lib": ["dom", ...` to `tsconfig.json`
     * 2) Find out how `localStorage` would work in non-browser clientes (e.g. node CLI)
     * 3) Uncomment below methods
     */

    /*
    private saveTokens(accessToken: string, refreshToken: string) {
        this.saveAccessToken(accessToken);
        this.saveRefreshToken(refreshToken);
    }

    private saveAccessToken(accessToken: string) {
        return localStorage.setItem(this.STORAGE_KEY_ACCESS_TOKEN, accessToken);
    }

    private getAccessToken() {
        return localStorage.getItem(this.STORAGE_KEY_ACCESS_TOKEN);
    }

    private removeAccessToken() {
        return localStorage.removeItem(this.STORAGE_KEY_ACCESS_TOKEN);
    }

    private saveRefreshToken(refreshToken: string) {
        return localStorage.setItem(this.STORAGE_KEY_REFRESH_TOKEN, refreshToken);
    }

    private getRefreshToken() {
        return localStorage.getItem(this.STORAGE_KEY_REFRESH_TOKEN);
    }

    private removeRefreshToken() {
        return localStorage.removeItem(this.STORAGE_KEY_REFRESH_TOKEN);
    }
    */
}
