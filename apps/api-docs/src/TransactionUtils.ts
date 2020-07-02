import { Transaction, TransactionHook } from 'hooks';

import { FixtureKey, Fixture, Identifiable, UserTokens, isFixtureKey } from './fixtureTypes';
import FixtureStore from './FixtureStore';

type LogFunction = (...any: any[]) => void;

// encapsulate transaction util functions with keeps hook execution context (fixture store, logging function)
export default class TransactionUtils {
    fixtureStore: FixtureStore;
    log: LogFunction;
    constructor(store: FixtureStore, log: LogFunction) {
        this.fixtureStore = store;
        this.log = log;
    }

    // define which transactions will be ran and in which order
    // inspired by https://github.com/apiaryio/dredd/issues/456
    selectTransactionsByName(transactions: Transaction[], slugs: string[]) {
        let keep = [];
        for (const transaction of transactions) {
            const idx = slugs.indexOf(transaction.name);
            if (idx > -1) {
                keep[idx] = transaction;
            }
        }
        transactions.splice(0, transactions.length);
        for (const i in keep) {
            transactions.push(keep[i]);
        }
    }

    // ensures that a transaction request has content type and accept headers set to a json mimetype
    setTransactionRequestJsonHeaders(transaction: Transaction) {
        if (!transaction.request.headers) {
            return;
        }
        transaction.request.headers['Content-Type'] = 'application/json';
        transaction.request.headers['Accept'] = 'application/json';
    }
    
    // replaces `${fixtureKey}_id` with ${fixture.id} in transaction request path
    writeFixtureIdInTransactionPath<T extends Identifiable>(key: FixtureKey): TransactionHook {
        return (transaction: Transaction) => {
            const fixture = this.fixtureStore.get<T>(key);
            if (fixture) {
                const replacedPath = transaction.origin.resourceName.replace(`{${key}_id}`, fixture.id);
                this.log(`[writeFixtureIdInTransactionPath] '${transaction.fullPath}' => '${replacedPath}'`)
                transaction.fullPath = replacedPath;
            } else {
                this.log(`[writeFixtureIdInTransactionPath] transaction '${transaction.id}' requires '${key}' fixture; skipping`)
                transaction.fail = true;
            }
        }
    }
    
    // grab the response body of a transaction and store it as a fixture
    storeTransactionResult<T extends Fixture>(key: FixtureKey): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.test.valid && transaction.real.body) {
                const data = JSON.parse(transaction.real.body);
                const typed = (data as T);
                if (typed) {
                    this.log(`[storeTransactionResult] '${transaction.request.method} (${transaction.real.statusCode}) ${transaction.fullPath}' => '${key}'`)
                    this.fixtureStore.put(key, data);
                } else {
                    this.log(`Couldn't save fixture '${key}', wrong datatype: '${JSON.stringify(data)}'`);
                    transaction.fail = true;
                }
            };
        };
    }
    
    // attach auth header if request requires it
    setTransactionRequestAuthHeaderWithFixture(key: FixtureKey): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.request.headers && transaction.request.headers.hasOwnProperty('Authorization')) {
                if (transaction.request.headers.Authorization === '') {
                    const authToken = this.fixtureStore.get<UserTokens>(key);
                    if (authToken && authToken.access_token) {
                        transaction.request.headers.Authorization = 'Bearer ' + authToken.access_token;
                    } else {
                        // hooks.log(`'${transaction.id}' requires 'authToken' fixture;`)
                        transaction.fail = true;
                    }
                }
            }
        }
    }
    
    // set the request body of a transaction to a fixture
    setTransactionRequestBodyToFixture<T extends Fixture> (key: FixtureKey): TransactionHook {
        return (transaction: Transaction) => {
            const fixture = this.fixtureStore.get<T>(key);
            if (fixture) {
                transaction.request.body = JSON.stringify(fixture);
            } else {
                this.log(`transaction '${transaction.id}' requires '${key}' fixture`)
                transaction.fail = true;
            }
        }
    }
    
    // parse transaction request body, applies `reqwriteFn`, then stringifies serializes it again
    rewriteTransactionRequestBody(rewriteFn: (body: any) => any): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.request.body) {
                const body = JSON.parse(transaction.request.body);
                rewriteFn(body);
                transaction.request.body = JSON.stringify(body);
            }
        }
    }
}
