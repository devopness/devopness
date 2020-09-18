import { AxiosResponse } from 'axios'

export class ApiResponse<T>{
    status: number;
    data: T;

    constructor(axiosResp: AxiosResponse<T>) {
        this.status = axiosResp.status;
        this.data = axiosResp.data;
    }
}
