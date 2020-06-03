import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ArgumentNullException, ApiError, NetworkError } from "../common/Exceptions";

export interface ConfigurationOptions {
    apiKey?: string;
    baseURL?: string;
}

export class Configuration implements ConfigurationOptions {
    // API_KEY may or may not be needed in the future.
    // so far only supporting authentication with user credentials
    public apiKey?: string;
    public baseURL = "https://api.devopness.com";

    constructor(options: ConfigurationOptions) {
        this.apiKey = options.apiKey;
        this.baseURL = options.baseURL || this.baseURL;
    }
}

export class ApiBaseService {
    private api: AxiosInstance;
    private static _accessToken: string;

    public static configuration: Configuration;

    // private static SDK_VERSION = '0.1';

    private defaultAxiosSettings: AxiosRequestConfig = {
        timeout: 30000,
        responseType: 'json',
        headers: {
            common: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // if we need to track SDK adoption and usage from the API servers,
                // setting the `User-Agent` with SDK version might be a solution
                // 'User-Agent': `devopness-sdk-js/${ApiBaseService.SDK_VERSION}`
            },
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
        this.setupAxiosInterceptors();
    }

    private setupAxiosInterceptors(): void {
        this.setupAxiosRequestInterceptors();
        this.setupAxiosResponseInterceptors();
    }

    private setupAxiosRequestInterceptors(): void {
        this.api.interceptors.request.use(
            (config: AxiosRequestConfig) => {
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
                return response;
            },
            (error: AxiosError) => {
                if (error.response) {
                    // server responded with a status code other than 2xx
                    throw new ApiError(error);
                } else if (error.request) {
                    // no response received. e.g.: client lost internet connection after request has been sent
                    throw new NetworkError(error);
                } else {
                    // request wasn't sent
                    throw new NetworkError(error);
                }
            }
        );
    }

    public static get accessToken(): string {
        return ApiBaseService._accessToken;
    }

    public static set accessToken(value: string) {
        ApiBaseService._accessToken = value;
    }

    public baseURL(): string {
        return this.api.defaults.baseURL ? this.api.defaults.baseURL : "";
    }

    protected async post<T, B, R = AxiosResponse<T>>(endpoint: string, data?: B): Promise<R> {
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

    public success<T>(response: AxiosResponse<T>): T {
        return response.data;
    }

    public error(error: AxiosError<Error>): void {
        throw error;
    }
}
