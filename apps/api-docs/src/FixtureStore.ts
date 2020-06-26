import { Transaction, TransactionHook } from 'hooks';
import { Fixture, FixtureKey } from './fixtureTypes'

export default class FixtureStore {
    store: { [key: string]: Fixture } = {};

    constructor() {
        this.store = {};
    }

    get<T extends Fixture>(key: FixtureKey): T | null {
        if (!(key as FixtureKey)) {
            // log(`invalid fixture key "${key}"`);
            return null
        }
        const typed = this.store[key] as T;
        if (typed) {
            return typed;
        }
        // log(`missing fixture "${key}"`);
        return null;
    }

    put(key: FixtureKey, value: Fixture): Fixture {
        // log(`storing fixture "${key}": ${JSON.stringify(value)}`);
        this.store[key] = value;
        return value;
    }

    delete(key: FixtureKey) {
        // log(`deleting fixture "${key}"`);
        delete this.store[key];
    }
};
