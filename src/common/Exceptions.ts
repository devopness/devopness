import { AxiosResponse } from 'axios'

export class ArgumentNullException extends Error {
    constructor(public param: string, method?: string, msg?: string) {
        // TO DO: check if it's possible to use reflection/prototype to retrieve the method name
        super(msg || `Value cannot be null. Missing required parameter: "${param}" when calling "${method}"`);
    }
}

export class ApiError<T> extends Error {
    errors?: any;
    request?: any;
    response?: AxiosResponse<T>;
    status: number;

    constructor(error: any) {
        if (!error.response) {
            throw error;
        }
        super('Devopness API response error');

        this.status = error.response.status;

        if (error.response.data) {
            if ((error.response.data as any).message) {
                this.message = (error.response.data as any).message;
            }
            if ((error.response.data as any).errors) {
                this.errors = (error.response.data as any).errors;
            }
        }
    }
}
