import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";

export interface Credentials {
  accessToken: string;
  email: string;
  password: string;
}

export class BaseApi {
  private api: AxiosInstance;
  public static baseUrl: string;

  defaultAxiosSettings: AxiosRequestConfig = {
    timeout: 30000,
    headers: {
      common: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    withCredentials: false
  }

  constructor(credentials?: Credentials, config?: AxiosRequestConfig) {
    /**
     * @todo: use credentials (email password)
     * @todo: refresh-token
     */
    const settings = Object.assign({}, config, this.defaultAxiosSettings);
    settings.baseURL = BaseApi.baseUrl;

    if (credentials && credentials.accessToken) {
      settings.headers.common.Authorization = 'Bearer ' + credentials.accessToken;
    }
    this.api = axios.create(settings);
  }

  protected authenticate(): void {
    //
  }

  public get<T, R = AxiosResponse<T>>(endpoint: string, config?: AxiosRequestConfig): Promise<R> {
    return this.api.get<T, R>(this.api.defaults.baseURL + endpoint, config);
  }
}
