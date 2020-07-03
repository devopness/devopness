import { AxiosError, AxiosResponse } from 'axios'

export class SdkError extends Error {
    constructor(message?: string) {
        super();
        this.setMessage(message || '');
    }

    private getFormattedMessage(message?: string): string {
        const SDK_ERROR_MESSAGE_PREFIX = 'Devopness SDK Error';

        return `${SDK_ERROR_MESSAGE_PREFIX} - ${message}`;
    }

    public setMessage(message: string): void {
        this.message = this.getFormattedMessage(message);
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

        this.setMessage(error.message);
        this.status = error.response.status;

        if (error.response.data) {
            const data = (error.response.data as ErrorResponseData);
            this.errors = data.errors;
            if (data.message) {
                // the `response.data` message might be more specific on helping diagnosing the
                // error root cause, so we set it as this ApiError message, when present
                this.setMessage(data.message);
            }
        }

        if (!this.message) {
            // if the message remains unset after checking for `error.message` and `error.response.data.message`
            // we use the `statusText` that usually contains a short the description of the HTTP status code
            // when an exception is an HTTP error
            this.setMessage(error.response?.statusText);
        }
    }
}
