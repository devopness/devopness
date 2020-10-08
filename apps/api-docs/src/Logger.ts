export type LogFunction = (...any: any[]) => void;

export default class Logger {
    logFn: LogFunction;
    keyHistory: { [key: string]: string[] };

    constructor(logFn: LogFunction) {
        this.logFn = logFn;
        this.keyHistory = {};
    }

    log(key: string, msg: string) {
        this.logFn(msg);

        const list = this.keyHistory[key] ? this.keyHistory[key] : [];
        list.push(msg);
        this.keyHistory[key] = list;
    }

    reLogEntriesWithKey(key: string) {
        this.keyHistory[key]?.forEach(entry => this.logFn(entry));
    }
}
