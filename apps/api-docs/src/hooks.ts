import hooks, { Transaction, TransactionHook } from 'hooks';
import { v1, v4 } from 'uuid';

import DevopnessAPI from './DevopnessAPI';
import { UserCredentials, UserTokens, isFixtureKey, Identifiable } from './fixtureTypes';
import FixtureStore from './FixtureStore';
import TransactionUtils from './TransactionUtils';
import TransactionGraph, { TransactionGraphEdge, FixtureTransactionAdjacencyList } from './TransactionGraph';
import Logger from './Logger';
import './augmentTransactionWithMetadata';
import OpenAPISpec from './OpenAPISpec';

// transaction names can be obtained by running `npx dredd --names`
const transactionSlugToName: { [id: string]: string } = {};

const fixtures = new FixtureStore();
const logger = new Logger(hooks.log);
const utils = new TransactionUtils(fixtures, logger);

// all setup code for the tests run inside this beforeAll hook
hooks.beforeAll((transactions: Transaction[], done: () => void) => {
    // transactions listed here aren't included in the execution plan
    const preSkiplist = [
        'replaceLinkedServers201',
        'connectServer200',
        // SSL certificates can only be added to applications that have a successful deployment
        'addApplicationSslCertificate201',
        'getSslCertificate200',
        'deleteSslCertificate204',
        'updateServer204',
        // A hook request is not created by the tests, so we don't have a valid hook_request_id
        'getHookRequest200',
        // @todo: Resolves conflicts to trigger a hook on dev-api
        'triggerHook200',
        'acceptInvitation204',
        // We do not create the member when the team is created, therefore we cannot retrieve a team member by its ID.
        'getTeamMember200',
        // @todo: fix team creation to enable tests for this endpoints
        'getTeam200',
        'updateTeam204',
        'deleteTeam204',
        'linkTeamToEnvironment204',
        'unlinkTeamFromEnvironment204',
        'deleteRole204',
        'sendTeamInvitation201',
        'getEnvironmentMemberProfile200',
        'getTeamMember200',
        'deleteTeamMember204',
        'sendInvitation201',
        // @todo: see how to fixture team_invitation_id
        'acceptTeamInvitation204',
        'linkServerToEnvironment201',
        'unlinkServerFromEnvironment204',
        'addProjectApplication201',
        'deleteEnvironment204',
        'addProjectCronJob201',
        'addProjectDaemon201',
        'addProjectServer201',
        'addProjectSshKey201',
        'listActions200',
        'getUserLogout204',
        // Skipping post resource events because we only support payment_provider events for now
        'addResourceEvent200',
        // The server created by tests is self-hosted, so we can't test endpoints
        // used for provisioned servers only
        'deleteServer204',
        'getStatusServer204',
        'startServer204',
        'restartServer204',
        'stopServer204',
        // Pending actions cannot be retried, so we can't test this endpoint
        'retryAction201',
        // We can't create subnet because we can't have a provisioned network
        'addNetworkSubnet201',
        'deleteSubnet204',
        'getSubnet200',
    ];

    // transactions listed here are skipped with a `before` hook
    const postSkiplist = [
        // source_provider has a static fixture, so don't delete it
        'deleteSourceProvider204',
        'deleteSocialAccount204',
        'deleteCredential204',
        // social_account related
        'getSocialAccount200',
        // email-dependant user transactions
        'activateUser204',
        'resetUserPassword200',
        'sendResetLinkUserPassword202',
    ];

    // initial fixture-transaction graph definitions
    const initialFixtureTransactionAdjacencyList: FixtureTransactionAdjacencyList = {
        fixtureTransactionInputs: {
            // adding an application requires a valid server
            'server': ['addEnvironmentApplication201'],
            // a `login` transaction requires user credentials
            'user_login': ['loginUser200'],
        },
        fixtureTransactionOutputs: {
            // `user`, `user_credentials` and `user_login` are available after successful
            // `addUser202` transaction, which hardcodes values for those two
            // fixtures, replacing the value defined on `fixtureTypes.ts`
            'user': ['addUser202'],
            'user_credentials': ['addUser202'],
            'user_login': ['addUser202'],

            // user_login_response is available after successful `loginUser200` transaction
            'user_login_response': ['loginUser200'],

            // A `pipeline` is returned by `addPipeline201`
            'pipeline': ['addPipeline201'],

            // An `ssl_certificate` is returned by `addApplicationSslCertificate201`
            'ssl_certificate': ['addApplicationSslCertificate201'],

            'network': ['addEnvironmentNetwork201'],

            'variable': ['addVariable201'],
        },
        fixtureTerminalTransactions: {
            // a successful `logout` transaction destroys user tokens
            'user_login_response': ['getUserlogout204']
        }
    };

    // initial transaction graph definitions
    const initialAdjacencyList = new Set<TransactionGraphEdge>([
        // variable tests should run before deleteApplication
        ['deleteHook204', 'deletePipeline204'],
        ['deleteHook204', 'deleteApplication204'],
        ['deleteVariable204', 'deleteApplication204'],
        ['triggerHook202', 'deleteApplication204'],
        ['addVariable201', 'deleteServer204'],
        // unlinkServerFromEnvironment requires deleting the associated ssh key, network rule, daemon, service, cron job and application
        ['deleteSshKey204', 'unlinkServerFromEnvironment204'],
        ['deleteNetworkRule204', 'unlinkServerFromEnvironment204'],
        ['deleteDaemon204', 'unlinkServerFromEnvironment204'],
        ['deleteService204', 'unlinkServerFromEnvironment204'],
        ['deleteCronJob204', 'unlinkServerFromEnvironment204'],
        ['deleteApplication204', 'unlinkServerFromEnvironment204'],
        // deleteEnvironment requires an environment without linked servers
        ['unlinkServerFromEnvironment204', 'deleteEnvironment204'],
        ['deletePipeline204', 'deleteEnvironment204'],
        ['deleteHook204', 'deleteEnvironment204'],
        ['linkStepToPipeline204', 'unlinkStepFromPipeline204'],
        ['unlinkStepFromPipeline204', 'deletePipeline204'],
        ['addPipeline201', 'listPipelinesByResourceType200'],
        ['addEnvironmentApplication201', 'linkResourceLinkToResourceLink204'],
        ['linkResourceLinkToResourceLink204', 'unlinkResourceLinkFromResourceLink204'],
    ]);

    let apiSpec = new OpenAPISpec(logger);

    // extract specs and attach them to transactions
    transactions.forEach((tx: Transaction) => {
        apiSpec.loadYaml(tx.origin.filename);
        apiSpec.attachTransactionMetadata(tx);
        hooks.log(``);

        // apply pre-skiplist
        if (!preSkiplist.includes(tx.slug)) {
            transactionSlugToName[tx.slug] = tx.name;
        }
    });

    // parse fixture dependencies from schema specs
    apiSpec.extractFixtureDependenciesFromDefinitions();

    // buld transaction graph from transaction specs and initial graph inputs
    const graph = new TransactionGraph(
        transactions.filter(tx => !preSkiplist.includes(tx.slug)),
        initialFixtureTransactionAdjacencyList,
        initialAdjacencyList,
        hooks.log
    );

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

    // apply execution plan
    utils.applyExecutionPlan(transactions, executionPlan.map(k => transactionSlugToName[k]));

    // attach graph inferred hooks
    transactions.forEach((transaction: Transaction, index: number) => {
        hooks.before(transaction.name, (_: Transaction) => {
            if (!failedTransaction) {
                hooks.log(``);
                const action = transaction.skip ? 'skipping' : 'running';
                logger.log(transaction.slug, `${index} :: ${action} ${transaction.slug}`);
            }
        });

        hooks.before(transaction.name, utils.writeFixtureIdsInTransactionPath());
        hooks.before(transaction.name, utils.applyTransactionRequestBodyFixtureDependencies());
        if (transaction.output && isFixtureKey(transaction.output)) {
            hooks.after(transaction.name, utils.storeTransactionResult(transaction.output));
        }
        if (transaction.slug.includes('Project')) {
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
    hooks.afterAll((_: Transaction[], done: () => void) => {
        if (failedTransaction) {
            hooks.log(``);
            hooks.log(`:: displaying hook logs of failed transaction...`);
            logger.reLogEntriesWithKey(failedTransaction.slug);
            hooks.log(``);
        }
        done();
    })

    //// request headers
    hooks.beforeEach(utils.setTransactionRequestAuthHeaderWithFixture('user_login_response'));
    hooks.beforeEach(utils.setTransactionRequestJsonHeaders);

    //// users
    before('addUser202', (transaction: Transaction) => {
        // randomize user, as db state won't be clean
        const randomCredentials: UserCredentials = { id: -1, email: `${v1()}@api-test.devopness`, password: v4() }
        transaction.request.body = JSON.stringify(randomCredentials);

        // use a predefined user fixture instead of the user we just created
        const usePredefinedCredentials = true;
        let credentials: UserCredentials
        if (usePredefinedCredentials) {
            credentials = { id: 8, email: 'test@test.com', password: 'testes' }
        } else {
            credentials = randomCredentials
        }
        fixtures.put('user_credentials', credentials)
    });

    before('refreshTokenUser200', utils.setTransactionRequestBodyToFixture<UserTokens>('user_login_response'));
    // after('getUserlogout204', (transaction: Transaction) => { if (transaction.test.valid) { fixtures.delete('user_login_response'); } });

    //// servers

    const beforeCreateServer = (transaction: Transaction) => {
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
    };

    before('addProjectServer201', beforeCreateServer);
    before('addEnvironmentServer201', beforeCreateServer);

    //// projects
    const randomizeName = (body: any) => {
        body['name'] = `test-project-${new Date().getTime()}`
    };
    before('addProject201', utils.rewriteTransactionRequestBody(randomizeName));
    before('updateProject204', utils.rewriteTransactionRequestBody(randomizeName));

    before('addEnvironmentApplication201', utils.rewriteTransactionRequestBody((body: any) => {
        body['entrypoint'] = 'index.html'
    }))

    before('updateApplication204', utils.rewriteTransactionRequestBody((body: any) => {
        body['entrypoint'] = 'index.html'
    }))

    //// source providers
    // use a static source_provider fixture, associated manually to the static user account
    // @todo: mock source provider
    const staticSourceProviderId = 7;
    before('addSourceProvider201', (transaction: Transaction) => {
        hooks.log(`=> 'source_provider' (id=${staticSourceProviderId})`)
        fixtures.put('source_provider', { id: `${staticSourceProviderId}` });
        transaction.skip = true;
    })

    const staticSocialAccountId = 'github';
    before('addSocialAccount201', (transaction: Transaction) => {
        hooks.log(`=> 'social_account' (id=${staticSocialAccountId})`)
        fixtures.put('social_account', { id: `${staticSocialAccountId}` });
        transaction.skip = true;
    })

    const staticCloudCredentialId = 6;
    before('addCloudProviderCredential201', (transaction: Transaction) => {
        hooks.log(`=> 'credential' (id=${staticCloudCredentialId})`)
        fixtures.put('credential', { id: `${staticCloudCredentialId}` });
        transaction.skip = true;
    })

    //// repositories
    before('getSourceProviderRepository200', (transaction: Transaction) => {
        transaction.fullPath = `/source-providers/${staticSourceProviderId}/repositories/devopness-api-tests/tester`
    })

    //// applications
    // delete the leftover default application using manual API calls
    const wait = (secs: number) => {
        const waitTill = new Date(new Date().getTime() + secs * 1000);
        while (waitTill > new Date()) { }
    }
    after('deleteApplication204', (transaction: Transaction) => {
        const authToken = fixtures.get<UserTokens>('user_login_response');
        const project = fixtures.get<Identifiable>('project');
        if (authToken && authToken.access_token && project) {
            const host = transaction.host;
            const api = new DevopnessAPI(host, authToken.access_token, hooks.log);
            const appIds = api.listEnvironmentApplications(project.id);
            for (const appId of appIds) {
                const success = api.deleteApplication(appId);
                if (!success) {
                    // TODO: treat errors here
                }
                wait(0.2);
            }
        }
    })

    //// teams
    before('addTeamToEnvironment201', utils.rewriteTransactionRequestBody((body: any) => {
        body['name'] = `team-${new Date().getTime()}`;
    }));

    //// networks
    before('addEnvironmentNetwork201', utils.rewriteTransactionRequestBody((body: any) => {
        body['provision_input'] = {
            credential_id: staticCloudCredentialId,
            cloud_service_code: 'aws-ec2',
            settings: {
                region: 'us-east-1',
                cidr_block: '10.0.0.0/24',
            },
        };
    }))

    before('listPipelinesByResourceType200', utils.rewriteTransactionRequestUriResourceId(['application']));
    before('addPipeline201', utils.rewriteTransactionRequestUriResourceId(['application']));
    before('unlinkResourceLinkFromResourceLink204', utils.rewriteTransactionRequestUriResourceId(['application']));
    before('linkResourceLinkToResourceLink204', utils.rewriteTransactionRequestUriResourceId(['application', 'daemon']));
    before('addVariable201', utils.rewriteTransactionRequestUriResourceId(['server']));
    done();
})
