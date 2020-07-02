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

import { UserCredentials, UserTokens } from './fixtureTypes';
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

    // build transaction graph
    const graph = new TransactionGraph(transactionSpecs);
    const txOrder = JSON.stringify(graph.topologicalSort());
    hooks.log(`possible transaction order: ${JSON.stringify(txOrder)}`);

    // specify which transactions will run in which order
    const transactionOrder: string[] = [
        'addUser201',
        'login200',
        'refreshToken200',
        'addProject201',
        'getProject200',
        'addSshKeyToProject201',
        'getSshKey200',
        'logout204'
    ].map(k => transactionSlugToName[k]);
    utils.selectTransactionsByName(transactions, transactionOrder);

    // attach graph inferred hooks
    transactions.forEach((transaction: Transaction) => {
        const transactionSpec = transactionNameToSpec[transaction.name];
        if (transactionSpec) {
            // TODO: handle request paths with multiple params
            // ex.: (`/environments/${environment_id}/servers/${server_id}/link`)
            if (transactionSpec.inputs.length > 0) {
                hooks.before(transaction.name, utils.writeFixtureIdInTransactionPath(transactionSpec.inputs[0]));
            }
            if (transactionSpec.output) {
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

    // projects
    const removeLogoImage = (body: any) => { delete body['logo_image']; }

    before('addProject201', utils.rewriteTransactionRequestBody(removeLogoImage));
    after('addProject201', utils.storeTransactionResult('project'));

    before('getProject200', utils.rewriteTransactionRequestBody(removeLogoImage));

    done();
})
