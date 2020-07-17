/**
 * @todo: assume an empty database before running this (i.e always run
 * `/db-reset` before running this script) ?
 *
 * @todo: implement basic `sign-up/login/logout` flow
 *
 * @todo: we can increment it by after sign-up and login create a project and a server inside a project,
 * assuming a default project environment for the server
 */
import hooks, { Transaction, TransactionHook } from 'hooks';
import { v1, v4 } from 'uuid';

import { UserCredentials, UserTokens, isFixtureKey, isFixtureListKey } from './fixtureTypes';
import FixtureStore  from './FixtureStore';
import TransactionUtils from './TransactionUtils';
import TransactionSpec from './TransactionSpec';
import TransactionGraph from './TransactionGraph';

// transaction names can be obtained by running `npx dredd --names`
const transactionSlugToName: { [id: string]: string } = {};
const transactionNameToSpec: { [id: string]: TransactionSpec } = {};

const fixtures = new FixtureStore();
const utils = new TransactionUtils(fixtures, hooks.log);

// all setup code for the tests run inside this beforeAll hook
hooks.beforeAll((transactions: Transaction[], done: () => void) => {
    // get transaction specs and build maps
    const transactionSpecs: TransactionSpec[] = [];
    transactions.forEach((tx: Transaction) => {
        const spec = new TransactionSpec(tx, hooks.log);
        transactionSlugToName[spec.slug] = tx.name;
        transactionNameToSpec[tx.name] = spec;
        transactionSpecs.push(spec);
    });

    // build transaction graph to find running order
    const graph = new TransactionGraph(transactionSpecs, hooks.log);
    const txOrder = graph.topologicalSort();
    // for (const i in txOrder) {
    //     const slug = txOrder[i];
    //     const [inputs, outputs] = graph.edges(slug);
    //     hooks.log(`${i}  \t  ${slug}:  (${inputs.join(', ')}) -> (${outputs.join(', ')})`);
    // }
    utils.selectTransactionsByName(transactions, txOrder.slice(0, 10).map(k => transactionSlugToName[k]));

    // attach graph inferred hooks
    transactions.forEach((transaction: Transaction) => {
        const transactionSpec = transactionNameToSpec[transaction.name];
        if (transactionSpec) {
            // TODO: test on (`/environments/${environment_id}/servers/${server_id}/link`)
            if (transactionSpec.pathInputs.length > 0) {
                hooks.before(transaction.name, utils.writeFixtureIdsInTransactionPath(transactionSpec.pathInputs));
            }
            if (transactionSpec.bodyInput && isFixtureKey(transactionSpec.bodyInput)) {
                if (["project", "project_create"].includes(transactionSpec.bodyInput)) {
                    hooks.log(`delete logo image: ${transactionSpec.bodyInput}`)
                    const removeLogoImage = (body: any) => { delete body['logo_image']; }
                    hooks.before(transaction.name, utils.rewriteTransactionRequestBody(removeLogoImage));
                }
                // body.id parameter should match path {fixture}_id parameter
                if (transactionSpec.pathInputs.includes(transactionSpec.bodyInput)) {
                    hooks.before(transaction.name, utils.setTransactionRequestBodyFixtureId(transactionSpec.bodyInput));
                }
            }
            if (transactionSpec.output && isFixtureKey(transactionSpec.output)) {
                hooks.after(transaction.name, utils.storeTransactionResult(transactionSpec.output));
            }
        }
    });

    // request headers
    hooks.beforeEach(utils.setTransactionRequestAuthHeaderWithFixture('user_tokens'));
    hooks.beforeEach(utils.setTransactionRequestJsonHeaders);

    //// shorthand methods for adding hooks by transaction slug
    const before = (id: string, cb: TransactionHook) => hooks.before(transactionSlugToName[id], cb);
    const after = (id: string, cb: TransactionHook) => hooks.after(transactionSlugToName[id], cb);

    // users
    before('addUser201', (transaction: Transaction) => {
        // randomize user, as db state won't be clean
        const credentials = { email: `${v1()}@api-test.devopness`, password: v4() }
        transaction.request.body = JSON.stringify(credentials);
        fixtures.put('user_credentials', credentials);
    });

    before('login200', utils.setTransactionRequestBodyToFixture<UserCredentials>('user_credentials'));

    before('refreshToken200', utils.setTransactionRequestBodyToFixture<UserTokens>('user_tokens'));

    after('logout204', (transaction: Transaction) => { if (transaction.test.valid) { fixtures.delete('user_tokens'); } });

    done();
})
