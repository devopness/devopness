export class ArgumentNullException extends Error {
    constructor(public param: string, method?: string, msg?: string) {
        // TO DO: check if it's possible to use reflection/prototype to retrieve the method name
        super(msg || `Value cannot be null. Missing required parameter: "${param}" when calling "${method}"`);
    }
}
