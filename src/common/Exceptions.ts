export class ArgumentNullException extends Error {
    constructor(public param: string, msg?: string) {
        super(msg || `Value cannot be null. Parameter: "${param}"`);
    }
}
