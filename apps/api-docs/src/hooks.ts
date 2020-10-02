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

import DevopnessAPI from './DevopnessAPI';
import { UserCredentials, UserTokens, isFixtureKey, Identifiable } from './fixtureTypes';
import FixtureStore from './FixtureStore';
import TransactionUtils from './TransactionUtils';
import TransactionSpec from './TransactionSpec';
import TransactionGraph, { TransactionAdjacencyList, FixtureTransactionAdjacencyList } from './TransactionGraph';

// transaction names can be obtained by running `npx dredd --names`
const transactionSlugToName: { [id: string]: string } = {};
const transactionNameToSpec: { [id: string]: TransactionSpec } = {};

const fixtures = new FixtureStore();
const utils = new TransactionUtils(fixtures, hooks.log);

// all setup code for the tests run inside this beforeAll hook
hooks.beforeAll((transactions: Transaction[], done: () => void) => {
    // transactions listed here aren't included in the execution plan
    const preSkiplist = [
        'replaceLinkedServers201',
        'connectServer200',
        // make all social_account routes unreachable by its skipping generator route
        'addSocialAccount201',
    ];

    // transactions listed here are skipped with a `before` hook
    const postSkiplist = [
        // source_provider has a static fixture, so don't delete it
        'deleteSourceProvider204',
        // social_account related
        'getSocialAccountStatusByName200',
        // email-dependant user transactions
        'activateUser204',
        'resetUserPassword200',
        'sendUserPasswordResetLink200',
    ];

    // initial fixture-transaction graph definitions
    const initialFixtureTransactionAdjacencyList: FixtureTransactionAdjacencyList = {
        fixtureTransactionInputs: {
            // adding an application requires a valid server
            'server': ['addApplicationToProject201'],
            // a `login` transaction requires user credentials
            'user_credentials': ['login200'],
        },
        fixtureTransactionOutputs: {
            // user credentials are generated from a successful `addUser` transaction
            'user_credentials': ['addUser201'],
            // user tokens are a result of a successful `login` transaction
            'user_tokens': ['login200'],
        },
        fixtureTerminalTransactions: {
            // a successful `logout` transaction destroys user tokens
            'user_tokens': ['logout204']
        }
    };

    // initial transaction graph definitions
    const initialAdjacencyList: TransactionAdjacencyList = [
        // variable tests should run before deleteApplication
        ['deleteVariable204', 'deleteApplication204'],
        ['deleteScript204', 'deleteApplication204'],
        // unlinkServerFromEnvironment requires deleting the associated ssh key, network rule, daemon, service, cron job and application
        ['deleteSshKey204', 'unlinkServerFromEnvironment204'],
        ['deleteNetworkRule204', 'unlinkServerFromEnvironment204'],
        ['deleteDaemon204', 'unlinkServerFromEnvironment204'],
        ['deleteService204', 'unlinkServerFromEnvironment204'],
        ['deleteCronJob204', 'unlinkServerFromEnvironment204'],
        ['deleteApplication204', 'unlinkServerFromEnvironment204'],
        // deleteEnvironment requires an environment without linked servers
        ['unlinkServerFromEnvironment204', 'deleteEnvironment204'],
        // actions are fetched from applications, so getApplication200 should run after deployApplication201
        ['deployApplication201', 'getApplication200']
    ]

    // extract transaction specs and other metadata; apply
    const transactionSpecs: TransactionSpec[] = [];
    transactions.forEach((tx: Transaction) => {
        const spec = new TransactionSpec(tx, hooks.log);

        // apply pre-skiplist
        if (!preSkiplist.includes(spec.slug)) {
            transactionSlugToName[spec.slug] = tx.name;
            transactionNameToSpec[tx.name] = spec;
            transactionSpecs.push(spec);
        }
    });

    // buld transaction graph from transaction specs and initial graph inputs
    const graph = new TransactionGraph(transactionSpecs, initialFixtureTransactionAdjacencyList, initialAdjacencyList, hooks.log);

    // calculate execution plan from dependency graph
    const executionPlan = graph.topologicalSort();

    // shorthand methods for adding hooks by transaction slug
    const executeIfTransactionNotSkipped = (cb: TransactionHook) => (transaction: Transaction) => {
        if (transaction.skip) return;
        cb(transaction);
    }
    const before = (id: string, cb: TransactionHook) => hooks.before(transactionSlugToName[id], executeIfTransactionNotSkipped(cb));
    const after = (id: string, cb: TransactionHook) => hooks.after(transactionSlugToName[id], executeIfTransactionNotSkipped(cb));

    // apply post-skiplist
    postSkiplist.forEach((slug: string) => {
        before(slug, (transaction: Transaction) => {
            transaction.skip = true;
        })
    })

    // uncomment the snippet below to display the planned transaction order
    /*
    for (const i in executionPlan) {
        const slug = executionPlan[i];
        const [inputs, outputs] = graph.edges(slug);
        hooks.log(`${i}  \t  ${slug}:  (${inputs.join(', ')}) -> (${outputs.join(', ')})`);
    }
    */

    // apply execution plan
    utils.applyExecutionPlan(transactions, executionPlan.map(k => transactionSlugToName[k]));

    // attach graph inferred hooks
    transactions.forEach((transaction: Transaction, index: number) => {
        const transactionSpec = transactionNameToSpec[transaction.name];
        if (transactionSpec) {
            hooks.before(transaction.name, (_: Transaction) => {
                hooks.log(``)
                hooks.log(`>> ${index} :: ${transactionSpec.slug}`)
            });

            // TODO: test on (`/environments/${environment_id}/servers/${server_id}/link`)
            hooks.before(transaction.name, utils.writeFixtureIdsInTransactionPath(transactionSpec.pathInputs, transactionSpec.pathInputDependencies));
            hooks.before(transaction.name, utils.applyTransactionRequestBodyFixtureDependencies(transactionSpec.bodyInputDependencies));
            if (transactionSpec.output && isFixtureKey(transactionSpec.output)) {
                hooks.after(transaction.name, utils.storeTransactionResult(transactionSpec.output));
            }
            if (transactionSpec.slug.includes('Project')) {
                const removeLogoImage = (body: any) => { delete body['logo_image']; }
                hooks.before(transaction.name, utils.rewriteTransactionRequestBody(removeLogoImage));
            }
            // 204 routes are not expected to return anything
            // but OpenAPI v2 specs don't allow for different `produces: <content-type>`
            // entries to be specified for each status code.
            // removing the 'content-type' expectation for 204 transactions fixes the issue
            if (transaction.expected.statusCode == 204) {
                delete transaction.expected.headers['Content-Type']
            }
        }
    });

    // skip all transactions after first failure
    let failedTransaction: Transaction | null = null;
    hooks.afterEach((transaction: Transaction) => {
        if (!transaction.skip && !transaction.test.valid) {
            hooks.log(`:: failed, skipping all following transactions`)
            failedTransaction = transaction;
            let i = transactions.indexOf(transaction) + 1;
            for (; i < transactions.length; i++) {
                transactions[i].skip = true;
            }
        }
    });

    // append additional details about failing transaction to logs
    hooks.afterAll((transactions: Transaction[], done: () => void) => {
        if (failedTransaction) {
            const transactionSpec = transactionNameToSpec[failedTransaction.name];
            if (transactionSpec) {
                const index = transactions.indexOf(failedTransaction)
                hooks.log(``)
                hooks.log(`:: failed on >> ${index} :: ${transactionSpec.slug}`)
            }
        }
        done();
    })

    //// request headers
    hooks.beforeEach(utils.setTransactionRequestAuthHeaderWithFixture('user_tokens'));
    hooks.beforeEach(utils.setTransactionRequestJsonHeaders);

    //// users
    before('addUser201', (transaction: Transaction) => {
        // randomize user, as db state won't be clean
        const randomCredentials = { email: `${v1()}@api-test.devopness`, password: v4() }
        transaction.request.body = JSON.stringify(randomCredentials);

        // use a predefined user fixture instead of the user we just created
        const usePredefinedCredentials = true;
        if (usePredefinedCredentials) {
            fixtures.put('user_credentials', { email: 'test@test.com', password: 'testes' })
        } else {
            fixtures.put('user_credentials', randomCredentials)
        }
    });

    before('login200', utils.setTransactionRequestBodyToFixture<UserCredentials>('user_credentials'));

    before('refreshToken200', utils.setTransactionRequestBodyToFixture<UserTokens>('user_tokens'));
    after('logout204', (transaction: Transaction) => { if (transaction.test.valid) { fixtures.delete('user_tokens'); } });

    //// servers
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
                    hooks.log(`${tag} transaction '${transaction.id}' requires 'project' fixture`);
                }
            }
        }
    })

    //// projects
    const randomizeName = (body: any) => {
        body['name'] = `test-project-${new Date().getTime()}`
    };
    before('addProject201', utils.rewriteTransactionRequestBody(randomizeName));
    before('updateProject204', utils.rewriteTransactionRequestBody(randomizeName));

    before('addApplicationToProject201', utils.rewriteTransactionRequestBody((body: any) => {
        body['entrypoint'] = 'index.html'
    }))

    //// source providers
    // use a static source_provider fixture, associated manually to the static user account
    const staticSourceProviderId = 11;
    before('addSourceProvider201', (transaction: Transaction) => {
        hooks.log(`=> 'source_provider' (id=${staticSourceProviderId})`)
        fixtures.put('source_provider', { id: `${staticSourceProviderId}` });
        transaction.skip = true;
    })

    //// repositories
    before('getRepository200', (transaction: Transaction) => {
        transaction.fullPath = `/source-providers/${staticSourceProviderId}/repositories/devopness-api-tests/tester`
    })

    //// applications
    // delete the leftover default application using manual API calls
    after('deleteApplication204', (transaction: Transaction) => {
        const authToken = fixtures.get<UserTokens>('user_tokens');
        const project = fixtures.get<Identifiable>('project');
        if (authToken && authToken.access_token && project) {
            const host = transaction.host;
            const api = new DevopnessAPI(host, authToken.access_token, hooks.log);
            const appIDs = api.listProjectApplications(project.id);
            if (appIDs.length > 0) {
                const success = api.deleteApplication(appIDs[0]);
                if (!success) {
                    // TODO: treat errors here
                }
            }
        }
    })

    //// logs
    before('getDeploymentStepLog200', (transaction: Transaction) => {
        const rep = transaction.fullPath.replace("{deployment_step_order}", "0");
        hooks.log(`[before:'getDeploymentStepLog200'] '${transaction.fullPath}' => '${rep}`);
        transaction.fullPath = rep;
    })



    done();
})
