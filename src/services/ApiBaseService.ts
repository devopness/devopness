import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ArgumentNullException, ApiError } from "../common/Exceptions";

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

    // public onTokenExpired: () => void;

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
            (error: any) => {
                throw error;
            }
        );
    }

    private setupAxiosResponseInterceptors(): void {
        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: any) => {
                throw new ApiError(error);
            }
        );
    }

    public static get accessToken(): string {
        return ApiBaseService._accessToken;
    }

    public static set accessToken(value: string) {
        ApiBaseService._accessToken = value;
    }

    public get baseURL(): string | undefined {
        return this.api.defaults.baseURL;
    }

    // TO DO: define events to notify the external world that a token has expired
    // so the consumer app can invoke refresh-token
    // so a web app might decide to redirect the user to login page or set
    // a or should we add an event parameter allowing `refresh: false` to be set to
    // true and we trigger refresh?
    // public tokenExpired(): void {
    //     if (this.onTokenExpired) {
    //         this.onTokenExpired();
    //     }
    // }

    protected async post<T, B, R = AxiosResponse<T>>(endpoint: string, data?: B): Promise<R> {
        return this.api.post<T, R>(endpoint, data);

        //     try {
        //         const response = await this.api.post<T, R>(endpoint, data);
        //         const result = response.data;
        //         return result;
        //     } catch (exception) {
        //         if (exception && exception.response) {
        //             const axiosError = exception as AxiosError<any>;
        //             return axiosError.response.data;
        //         }

        //         throw err;
        //     }
        // };

    }

    protected async put<T, B, R = AxiosResponse<T>>(endpoint: string, data?: B): Promise<R> {
        return this.api.post<T, R>(endpoint, data);
    }

    protected delete<T, R = AxiosResponse<T>>(endpoint: string): Promise<R> {
        /**
         * @todo: why not return `response.data` from here instead of AxiosResponse<T>?
         */
        return this.api.get<T, R>(this.api.defaults.baseURL + endpoint);
    }

    protected get<T, R = AxiosResponse<T>>(endpoint: string): Promise<R> {
        return this.api.get<T, R>(this.api.defaults.baseURL + endpoint);
    }

    public success<T>(response: AxiosResponse<T>): T {
        return response.data;
    }

    public error(error: AxiosError<Error>): void {
        throw error;
    }
}
