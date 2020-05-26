import { AxiosError, AxiosResponse } from 'axios'

export class ArgumentNullException extends Error {
    constructor(public param: string, method?: string, msg?: string) {
        // TO DO: check if it's possible to use reflection/prototype to retrieve the method name
        super(msg || `Value cannot be null. Missing required parameter: "${param}" when calling "${method}"`);
    }
}

export interface ErrorResponseData {
    message: string | undefined;
    errors?: Array<Record<string, string>>;
}

export class ApiError<T> extends Error {
    errors?: Array<Record<string, string>>;
    // request?: any;
    response?: AxiosResponse<T>;
    status: number;

    constructor(error: AxiosError) {
        if (!error.response) {
            throw error;
        }
        super('Devopness API response error');

        this.status = error.response.status;

        if (error.response.data) {
            const data = (error.response.data as ErrorResponseData);
            this.errors = data.errors;
            if (data.message) {
                this.message = data.message;
            }
        }
    }
}
