import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import { ArgumentNullException } from "../common/Exceptions";

export interface ConfigurationOptions {
    apiKey?: string;
    // email?: string;
    // password?: string;
    // accessToken?: string;
    baseUrl: string;
}

export class Configuration implements ConfigurationOptions {
    // API_KEY may or may not be needed in the future.
    // so far only supporting authentication with user credentials
    public apiKey?: string;
    // public email?: string;
    // public password?: string;
    // public accessToken?: string;
    public baseUrl: string;

    constructor(options: ConfigurationOptions) {
        this.apiKey = options.apiKey;
        // this.email = options.email;
        // this.password = options.password;
        // this.accessToken = options.accessToken;
        this.baseUrl = options.baseUrl;
    }
}

export class ApiBaseService {
    private api: AxiosInstance;
    public static configuration: Configuration;

    private defaultAxiosSettings: AxiosRequestConfig = {
        timeout: 30000,
        responseType: 'json',
        headers: {
            common: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        },
        withCredentials: false
    }

    constructor() {
        if (ApiBaseService.configuration == undefined) {
            throw new ArgumentNullException('configuration');
        }

        const settings = this.defaultAxiosSettings;
        settings.baseURL = ApiBaseService.configuration.baseUrl;

        this.api = axios.create(settings);
    }

    protected post<T, B, R = AxiosResponse<T>>(endpoint: string, data?: B): Promise<R> {
        return this.api.post<T, R>(endpoint, data);
    }

    protected get<T, R = AxiosResponse<T>>(endpoint: string): Promise<R> {
        return this.api.get<T, R>(this.api.defaults.baseURL + endpoint);


        // .then((response: R) => {
        //     return response.data<T>;
        // })
        // .then((res: R) => res);
    }

    public success<T>(response: AxiosResponse<T>): T {
        return response.data;
    }
}
