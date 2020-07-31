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

import { UserCredentials, UserTokens, isFixtureKey, isFixtureListKey, Identifiable } from './fixtureTypes';
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
    // skip some transactions
    const skipTransactions = [
        'replaceLinkedServers201',
        'unlinkServerFromEnvironment204',
        'connectServer200',
    ];

    // get transaction specs and build maps
    const transactionSpecs: TransactionSpec[] = [];
    transactions.forEach((tx: Transaction) => {
        const spec = new TransactionSpec(tx, hooks.log);
        if (!skipTransactions.includes(spec.slug)) {
            transactionSlugToName[spec.slug] = tx.name;
            transactionNameToSpec[tx.name] = spec;
            transactionSpecs.push(spec);
        }
    });

    // build transaction graph to find running order
    const graph = new TransactionGraph(transactionSpecs, hooks.log);
    const txOrder = graph.topologicalSort();
    // uncomment the snippet below to display the planned transaction order
    /*
    for (const i in txOrder) {
        const slug = txOrder[i];
        const [inputs, outputs] = graph.edges(slug);
        hooks.log(`${i}  \t  ${slug}:  (${inputs.join(', ')}) -> (${outputs.join(', ')})`);
    }
    */
    const numTests = 77;
    hooks.log(`running ${numTests}/${transactions.length} transactions`);
    utils.selectTransactionsByName(transactions, txOrder.slice(0, numTests).map(k => transactionSlugToName[k]));

    // attach graph inferred hooks
    transactions.forEach((transaction: Transaction, index: number) => {
        const transactionSpec = transactionNameToSpec[transaction.name];
        if (transactionSpec) {
            hooks.before(transaction.name, (_: Transaction) => hooks.log(`>> (${index}) ${transactionSpec.slug}`));

            // TODO: test on (`/environments/${environment_id}/servers/${server_id}/link`)
            hooks.before(transaction.name, utils.writeFixtureIdsInTransactionPath(transactionSpec.pathInputs));
            hooks.before(transaction.name, utils.applyTransactionRequestBodyFixtureDependencies(transactionSpec.bodyInput));
            if (transactionSpec.output && isFixtureKey(transactionSpec.output)) {
                hooks.after(transaction.name, utils.storeTransactionResult(transactionSpec.output));
            }
            if (transactionSpec.slug.includes('Project')) {
                const removeLogoImage = (body: any) => { delete body['logo_image']; }
                hooks.before(transaction.name, utils.rewriteTransactionRequestBody(removeLogoImage));
            }
        }
    });

    // skip all transactions after first failure
    hooks.afterEach((transaction: Transaction) => {
        if (!transaction.skip && !transaction.test.valid) {
            let i = transactions.indexOf(transaction) + 1;
            for (; i < transactions.length; i++) {
                transactions[i].skip = true;
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

    // servers
    before('addServerToProject201', (transaction: Transaction) => {
        const tag = `[fake-server]`
        if (transaction.request.body) {
            const body = JSON.parse(transaction.request.body);
            if (body.hostname) {
                transaction.request.body = "";
                const project = fixtures.get<Identifiable>('project');
                if (project) {
                    const path = `/dev-tests/fake-server/${project.id}/${body.hostname}`;
                    hooks.log(`${tag} rewrite path '${transaction.fullPath}' => '${path}'`);
                    transaction.fullPath = path;
                } else {
                    hooks.log(`${tag} transaction '${transaction.id}' requires 'project' fixture`)
                }
            }
        }
    })

    // projects
    before('addApplicationToProject201', utils.rewriteTransactionRequestBody((body: any) => {
        body['entrypoint'] = 'index.html'
    }))

    done();
})
