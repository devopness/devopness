import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ArgumentNullException, ApiError, NetworkError } from "../common/Exceptions";

declare const window: unknown;

export interface ConfigurationOptions {
    apiKey?: string;
    baseURL?: string;
    callbacks?: { onTokenExpired: (data: string) => void; };
}

export class Configuration implements ConfigurationOptions {
    // API_KEY may or may not be needed in the future.
    // so far only supporting authentication with user credentials
    public apiKey?: string;
    public baseURL = "https://api.devopness.com";
    public callbacks?: { onTokenExpired: (data: string) => void; };

    constructor(options: ConfigurationOptions) {
        this.apiKey = options.apiKey;
        this.baseURL = options.baseURL || this.baseURL;
        this.callbacks = options.callbacks;
    }
}

export class ApiBaseService {
    private api: AxiosInstance;
    private static _accessToken: string;
    private static _refreshToken: string;
    private static _accessTokenExpiresAt = 0;

    public static configuration: Configuration;

    private static SDK_VERSION = '0.0.0-development';

    private defaultAxiosSettings: AxiosRequestConfig = {
        timeout: 30000,
        responseType: 'json',
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json"
        },
        withCredentials: false
    }

    constructor() {
        if (ApiBaseService.configuration == undefined) {
            throw new ArgumentNullException('configuration');
        }

        const settings = this.defaultAxiosSettings;
        settings.baseURL = ApiBaseService.configuration.baseURL;

        this.api = axios.create(settings);
        this.setupAxios();
    }

    private setupAxios(): void {
        this.setUserAgent();
        this.setupAxiosRequestInterceptors();
        this.setupAxiosResponseInterceptors();
    }

    private setUserAgent(): void {
        // Firefox is fine with setting the 'User-Agent' header, but Chrome and Safari are not.
        // As we don't want Chrome to raise piles of console logs with the error message:
        // 'Refused to set unsafe header "User-Agent"', we then only set the UA header
        // when the SDK is not being consumed from an app running on a browser foreground.
        // i.e: node.js cli, node.js server side, web workers, ...
        // if a window object is defined then we're very likely on a browser
        // so we don't set a custom User-Agent header
        const runningOnBrowserForeground = typeof window !== 'undefined';
        if (!runningOnBrowserForeground) {
            // Setting the `User-Agent` with SDK version so we can track SDK adoption
            // through requests sent through it hitting our API servers
            this.api.defaults.headers.common['User-Agent'] = `devopness-sdk-js/${ApiBaseService.SDK_VERSION}`;
        }
    }

    private setupAxiosRequestInterceptors(): void {
        this.api.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                if (!config.headers) {
                    config.headers = {};
                }
                if (ApiBaseService._accessToken) {
                    config.headers.Authorization = `Bearer ${ApiBaseService._accessToken}`;
                } else {
                    delete config.headers.Authorization;
                }

                return config;
            },
            (error: AxiosError) => {
                throw error;
            }
        );
    }

    private setupAxiosResponseInterceptors(): void {
        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                const { access_token, refresh_token, expires_in } = response.data;
                this.setAuthParams(access_token, refresh_token, expires_in);

                return response;
            },
            (error: AxiosError) => {
                if (this.isTokenExpired(error.response)) {
                    // access_token is expired (verified with expires_at field) 
                    ApiBaseService.configuration.callbacks?.onTokenExpired(
                        ApiBaseService._refreshToken
                    )
                    return error.response
                } else if (error.response) {
                    // server responded, but with a status code other than 2xx
                    throw new ApiError(error);
                } else if (error.request) {
                    // no response received. e.g.: client lost internet connection after request has been sent
                    throw new NetworkError(error);
                } else {
                    // request wasn't sent. e.g: invalid IP/DNS provided as API base URL
                    throw new NetworkError(error);
                }
            }
        );
    }

    private setAuthParams(accessToken : string, refreshToken : string, expiresIn : number) : void {
        ApiBaseService._accessToken = accessToken || ApiBaseService._accessToken;
        ApiBaseService._refreshToken = refreshToken || ApiBaseService._refreshToken;
        ApiBaseService._accessTokenExpiresAt = expiresIn
            ? Date.now() + expiresIn
            : ApiBaseService._accessTokenExpiresAt;
    }

    private isTokenExpired(response: any): boolean {
        return response?.status === 401 && Date.now() > ApiBaseService._accessTokenExpiresAt;
    }

    public baseURL(): string {
        return this.api.defaults.baseURL ? this.api.defaults.baseURL : "";
    }

    protected async post<T, B = undefined, R = AxiosResponse<T>>(endpoint: string, data?: B): Promise<R> {
        return this.api.post<T, R>(endpoint, data);
    }

    protected async put<T, B, R = AxiosResponse<T>>(endpoint: string, data?: B): Promise<R> {
        return this.api.put<T, R>(endpoint, data);
    }

    protected delete<T, R = AxiosResponse<T>>(endpoint: string): Promise<R> {
        return this.api.delete<T, R>(endpoint);
    }

    protected get<T, R = AxiosResponse<T>>(endpoint: string): Promise<R> {
        return this.api.get<T, R>(endpoint);
    }
}
