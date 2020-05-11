import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";

export class BaseApi {
  private api: AxiosInstance;

  defaultAxiosSettings: AxiosRequestConfig = {
    baseURL: "https://base-url",
    timeout: 30000,
    headers: {
      common: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    withCredentials: false
  }

  constructor(credentials?: any, config?: AxiosRequestConfig) {
    /**
     * @todo: use credentials (email password)
     * @todo: refresh-token
     */
    const settings = Object.assign({}, config, this.defaultAxiosSettings);
    if (credentials && credentials.accessToken) {
      settings.headers.common.Authorization = 'Bearer ' + credentials.accessToken;
    }
    this.api = axios.create(settings);
  }

  public get<T, R = AxiosResponse<T>>(endpoint: string, config?: AxiosRequestConfig): Promise<R> {
    return this.api.get<T, R>(this.api.defaults.baseURL + endpoint);
  }
}
