import { AxiosError, AxiosResponse } from 'axios'

export class SdkError extends Error {
    constructor(message?: string) {
        super(`Devopness SDK Error - ${message}`);
    }
}

export class ArgumentNullException extends SdkError {
    constructor(public param: string, method?: string, msg?: string) {
        super(msg || `Value cannot be null. Missing required parameter: "${param}" when calling "${method}"`);
    }
}

export interface ErrorResponseData {
    message: string | undefined;
    errors?: Array<Record<string, string>>;
}

export class NetworkError extends SdkError {
    constructor(error: AxiosError) {
        super(error.message);
    }
}

export class ApiError<T> extends SdkError {
    errors?: Array<Record<string, string>>;
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
