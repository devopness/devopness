/**
 * A function that logs a string.
 */
export type LogFunction = (msg: string) => void;
/**
 * Generates a log function that uses a prefix tag
 * @param log Base log function
 * @param tag Tag to be prepended to logged messages
 */
export function attachTagToLogFunction(log: LogFunction, tag: string): LogFunction {
    return (msg: string) => log(`[${tag}] ${msg}`);
}

/**
 * Logger class that persists entries with a string index (key) and replaying entries with a given key.
 */
export default class Logger {
    logFn: LogFunction;
    keyHistory: { [key: string]: string[] };

    /**
     * @param logFn Base log function (console.log, hooks.log, etc.)
     */
    constructor(logFn: LogFunction) {
        this.logFn = logFn;
        this.keyHistory = {};
    }

    /**
     * Logs a string entry and associates it with a key.
     * @param key Key used to store the entry
     * @param msg Entry to be logged
     */
    log(key: string, msg: string) {
        this.logFn(msg);

        const list = this.keyHistory[key] ? this.keyHistory[key] : [];
        list.push(msg);
        this.keyHistory[key] = list;
    }

    /**
     * Re-log all entries associated with a given key.
     * @param key Key of entries to be re-logged
     */
    reLogEntriesWithKey(key: string) {
        this.keyHistory[key]?.forEach(entry => this.logFn(entry));
    }
}
