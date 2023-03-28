import { Transaction, TransactionHook } from 'hooks';
import { get, set } from 'lodash';

import { FixtureKey, Fixture, Identifiable, UserTokens } from './fixtureTypes';
import FixtureStore from './FixtureStore';
import Logger from './Logger';
import './augmentTransactionWithMetadata';

/**
 * Methods for managing dredd transactions and hook execution
 */
export default class TransactionUtils {
    fixtureStore: FixtureStore;
    logger: Logger;

    constructor(store: FixtureStore, logger: Logger) {
        this.fixtureStore = store;
        this.logger = logger;
    }

    /**
     * Sets which transactions will be ran and their order.
     * Inspired by https://github.com/apiaryio/dredd/issues/456
     * @param transactions List of all transactions
     * @param slugs Order of transactions that will be executed
     */
    applyExecutionPlan(transactions: Transaction[], slugs: string[]) {
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

    /**
     * Ensures that a transaction request has content type and accept headers set to a json mimetype.
     * @param transaction Target Transaction
     */
    setTransactionRequestJsonHeaders(transaction: Transaction) {
        if (!transaction.request.headers) {
            return;
        }
        transaction.request.headers['Content-Type'] = 'application/json';
        transaction.request.headers['Accept'] = 'application/json';
    }

    /**
     * Returns a `TransactionHook` that replaces `${fixtureKey}_id` with ${fixture.id} in transaction request path.
     */
    writeFixtureIdsInTransactionPath(): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.skip) return;

            const { slug, pathInputs, pathInputDependencies } = transaction;
            if (pathInputs.length == 0 && Object.keys(pathInputDependencies).length == 0) return;

            let path = transaction.origin.resourceName;
            const tag = `[writeFixtureIdsInTransactionPath]`;
            for (const key of pathInputs) {
                const fixture = this.fixtureStore.get<Identifiable>(key);
                if (fixture) {
                    path = path.replace(`{${key}_id}`, fixture.id);
                } else {
                    this.logger.log(slug, `\x1b[31;1m${tag} transaction '${transaction.id}' path '${path}': requires fixture '${key}'.\x1b[0m`);
                    transaction.fail = true;
                    break;
                }
            }
            for (const key in pathInputDependencies) {
                // if the necessary fixture is already resolved, use the stored version
                const fixture = this.fixtureStore.get<Identifiable>(key);
                if (fixture) {
                    path = path.replace(`{${key}_id}`, fixture.id);
                    continue;
                }

                // otherwise compose the fixture by applying the dependencies
                const deps = pathInputDependencies[key];
                const depId = deps.find((dep) => dep.path === 'id');
                if (depId) {
                    const fixture = this.fixtureStore.get(depId.fixture);
                    if (fixture) {
                        const value = get(fixture, depId.field);
                        if (value) {
                            path = path.replace(`{${key}_id}`, value);
                        } else {
                            this.logger.log(slug, `${tag} transaction '${transaction.id}' requires ${depId.fixture}.${depId.field} to exist`);
                            transaction.fail = true;
                            break;
                        }
                    } else {
                        this.logger.log(
                            slug,
                            `${tag} transaction '${transaction.id}' path '${path}': fixture '${key}' param '${depId.path}' ` +
                            `depends on '${depId.fixture}' fixture, but parameter '${depId.path}' could not be resolved. ` +
                            `Tip: ensure parameter name '${depId.path}' is correct for operation '${transaction.id}' ` +
                            `and its value is correctly set for fixture '${key}' on 'fixtureTypes.ts' file.`
                        );
                        transaction.fail = true;
                        break;
                    }
                }
            }
            if (!transaction.fail) {
                this.logger.log(slug, `${tag} '${transaction.fullPath}' => '${path}'`);
            }

            // Replaces any other parameter in the URL by it's example value.
            if (path.indexOf('{') >= 0) {
                const examples = transaction.request.uri.split('/');
                const params = path.split('/');
                path = '';

                for (let i = 1; i < params.length; i++) {
                    if (params[i][0] != '{') {
                        path += '/' + params[i];
                        continue;
                    }

                    path += '/' + examples[i];
                }
            }

            transaction.fullPath = path;

            // dredd uses `transaction.id` in its logging
            // as it carries the `transaction.fullPath`, we need to rebuild it
            transaction.id = `${transaction.request.method} (${transaction.expected.statusCode}) ${path}`
        }
    }

    /**
     * Rerturns a `TransactionHook` that grabs the response body of a transaction and stores it as a fixture.
     * @param key Key of the transaction result fixture
     */
    storeTransactionResult<T extends Fixture>(key: FixtureKey): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.skip) return;
            if (transaction.test.valid && transaction.real.body) {
                const tag = `[storeTransactionResult]`;
                const data = JSON.parse(transaction.real.body);
                const typed = (data as T);
                if (typed) {
                    this.logger.log(transaction.slug, `${tag} => '${key}' (id=${data.id})`)
                    this.fixtureStore.put(key, data);
                } else {
                    this.logger.log(transaction.slug, `${tag} couldn't save fixture '${key}', wrong datatype: '${JSON.stringify(data)}'`);
                    transaction.fail = true;
                }
            };
        };
    }

    /**
     * Returns a `TransactionHooks` that attaches a Berer Authorization token if a request requires it.
     * @param key Key of the fixture containing the auth headers
     */
    setTransactionRequestAuthHeaderWithFixture(key: FixtureKey): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.skip) return;
            if (transaction.request.headers && transaction.request.headers.hasOwnProperty('Authorization')) {
                if (transaction.request.headers.Authorization === '') {
                    const authToken = this.fixtureStore.get<UserTokens>(key);
                    if (authToken && authToken.access_token) {
                        transaction.request.headers.Authorization = 'Bearer ' + authToken.access_token;
                    } else {
                        throw new Error(`${transaction.slug} ${transaction.id} [setTransactionRequestAuthHeaderWithFixture] requires 'authToken' fixture. Ensure login response is setting the access_token on '${key}' fixture.`);
                    }
                }
            }
        }
    }

    /**
     * Returns a `TransactionHook` that sets the request body of a transaction to a fixture.
     * @param key Key of the fixture
     */
    setTransactionRequestBodyToFixture<T extends Fixture>(key: FixtureKey): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.skip) return;
            const fixture = this.fixtureStore.get<T>(key);
            if (fixture) {
                transaction.request.body = JSON.stringify(fixture);
            } else {
                this.logger.log(transaction.slug, `${transaction.id} [setTransactionRequestBodyToFixture] missing '${key}' fixture`);
                transaction.fail = true;
            }
        }
    }

    /**
     * Returns a `TransactionHook` that rewrites the request body of a transaction.
     * Parse transaction request body JSON, applies `rewriteFn`, then stringifies serializes it again
     * @param rewriteFn Rewrite function
     */
    rewriteTransactionRequestBody(rewriteFn: (body: any) => any): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.skip) return;
            if (transaction.request.body) {
                const body = JSON.parse(transaction.request.body);
                rewriteFn(body);
                transaction.request.body = JSON.stringify(body);
            }
        }
    }

    rewriteTransactionRequestUriResourceId(resourceTypes: string[]): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.skip) {
                return;
            }

            let path = transaction.request.uri;

            for (const resourceType of resourceTypes) {
                const resourceId = this.fixtureStore.get<Identifiable>(resourceType)?.id as string;
                path = path.replace(
                    new RegExp(`${resourceType}\/[0-9]+`),
                    `${resourceType}/${resourceId}`,
                );
            }

            transaction.fullPath = path;
            transaction.id = `${transaction.request.method} (${transaction.expected.statusCode}) ${path}`;
        }
    }

    /**
     * Returns a `TransactionHook` that resolves all fixture dependencies in a request body.
     * Applies `TransactionDependency` rewriting rules in the body data, using data present in the fixture store.
     */
    applyTransactionRequestBodyFixtureDependencies(): TransactionHook {
        return (transaction: Transaction) => {
            if (transaction.skip) return;

            const { slug, bodyInputDependencies } = transaction;
            if (bodyInputDependencies.length == 0) return;

            const tag = `[applyTransactionRequestBodyFixtureDependencies]`;

            if (transaction.request.body) {
                const body = JSON.parse(transaction.request.body);
                for (const dep of bodyInputDependencies) {
                    const fixture: any = this.fixtureStore.get(dep.fixture);
                    if (fixture) {
                        const depData = fixture[dep.field];
                        if (depData) {
                            // if the last part of the replacement is a list indexing, replace the whole list instead
                            if (dep.path.match(/.*\[[0-9]+\]$/)) {
                                const directPath = dep.path.replace(/[[0-9]+\]$/, '');
                                this.logger.log(slug, `${tag} body.${directPath}=${JSON.stringify([depData])}`);
                                set(body, directPath, [depData]);
                            } else {
                                this.logger.log(slug, `${tag} body.${dep.path}=${JSON.stringify(depData)}`);
                                set(body, dep.path, depData);
                            }
                        } else {
                            this.logger.log(slug, `${tag} fixture '${dep.fixture}' has no '${dep.field}' field`);
                            transaction.fail = true;
                        }
                    } else {
                        this.logger.log(slug, `${tag} missing '${dep.fixture}' fixture`);
                        transaction.fail = true;
                    }
                }
                transaction.request.body = JSON.stringify(body);
            }
        }
    }


    /**
     * Returns a `TransactionHook` that logs the transaction as pretty-printed JSON.
     */
    transactionLogger(): TransactionHook {
        return (transaction: Transaction) => {
            this.logger.log(transaction.slug, JSON.stringify(transaction, null, 2));
        }
    }
}
