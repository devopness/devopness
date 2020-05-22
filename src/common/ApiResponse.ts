import { AxiosResponse } from 'axios'

export interface ApiResponse<T>{
    status: number,
    data: T
}

export function apiResponseFromAxiosResponse<T>(axiosResp: AxiosResponse<T>): ApiResponse<T> {
    return {
        status: axiosResp.status,
        data: axiosResp.data
    }
}