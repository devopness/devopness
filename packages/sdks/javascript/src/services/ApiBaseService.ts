import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiError, ArgumentNullException, NetworkError } from "../common/Exceptions";

declare const window: unknown;

export interface ConfigurationOptions {
    apiToken?: string;
    baseURL?: string;
}

export class Configuration implements ConfigurationOptions {
    public apiToken?: string;
    public baseURL = "https://api.devopness.com";

    constructor(options: ConfigurationOptions) {
        this.apiToken = options.apiToken;
        this.baseURL = options.baseURL || this.baseURL;
    }
}

export class ApiBaseService {
    private api: AxiosInstance;
    private static _accessToken: string;
    private static _apiToken: string|undefined;
    private static _onTokenExpired: (accessToken: string) => void;

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

        ApiBaseService._apiToken = ApiBaseService.configuration.apiToken;

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
            (config: InternalAxiosRequestConfig) => {
                if (!config.headers) {
                    config.headers = <AxiosRequestHeaders>{};
                }

                if (ApiBaseService._apiToken) {
                    config.headers.Authorization = `Bearer ${ApiBaseService._apiToken}`;
                }
                else if (ApiBaseService._accessToken) {
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
                return response;
            },
            (error: AxiosError) => {
                if (this.isTokenExpired(error.response)) {
                    // access_token is expired
                    ApiBaseService._onTokenExpired(ApiBaseService._accessToken);
                    return error.response
                }
                if (error.response) {
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


    public static get apiToken(): string | undefined {
        return ApiBaseService._apiToken;
    }

    public static set apiToken(value: string | undefined) {
        ApiBaseService._apiToken = value;
    }

    public static get accessToken(): string {
        return ApiBaseService._accessToken;
    }

    public static set accessToken(value: string) {
        ApiBaseService._accessToken = value;
    }

    public static set onTokenExpired(callback: (accessToken: string) => void) {
        ApiBaseService._onTokenExpired = callback;
    }

    protected isTokenExpired(response: AxiosResponse | undefined): boolean {
        if (!ApiBaseService.accessToken) {
            return false;
        }

        const decodedToken = JSON.parse(
            Buffer.from(ApiBaseService.accessToken?.split(".")?.[1], "base64").toString()
        );

        return response?.status === 401 && decodedToken.exp < (new Date().getTime() / 1000);
    }

    public baseURL(): string {
        return this.api.defaults.baseURL ? this.api.defaults.baseURL : "";
    }

    protected async post<T, B = undefined, R = AxiosResponse<T>>(endpoint: string, data?: B): Promise<R> {
        return this.api.post<T, R>(endpoint, data);
    }

    protected async put<T, B = undefined, R = AxiosResponse<T>>(endpoint: string, data?: B): Promise<R> {
        return this.api.put<T, R>(endpoint, data);
    }

    protected delete<T, R = AxiosResponse<T>>(endpoint: string): Promise<R> {
        return this.api.delete<T, R>(endpoint);
    }

    protected get<T, R = AxiosResponse<T>>(endpoint: string): Promise<R> {
        return this.api.get<T, R>(endpoint);
    }
}
