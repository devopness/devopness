import { Fixture, FixtureKey } from './fixtureTypes'

/**
 * FixtureKey -> Fixture map with runtime type-checking of keys.
 */
export default class FixtureStore {
    store: { [key: string]: Fixture } = {};

    constructor() {
        this.store = {};
    }

    get<T extends Fixture>(key: FixtureKey): T | null {
        if (!(key as FixtureKey)) {
            // invalid fixture key
            return null
        }
        const typed = this.store[key] as T;
        if (typed) {
            return typed;
        }
        // fixture not found
        return null;
    }

    put(key: FixtureKey, value: Fixture): Fixture {
        this.store[key] = value;
        return value;
    }

    delete(key: FixtureKey) {
        delete this.store[key];
    }
};
