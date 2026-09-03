import hooks, { Transaction, TransactionHook } from 'hooks';

import './augmentTransactionWithMetadata';
import DevopnessAPI from './DevopnessAPI';
import env from './envLoader';
import FixtureStore from './FixtureStore';
import { Identifiable, PersonalAccessToken, User, isFixtureKey } from './fixtureTypes';
import Logger from './Logger';
import OpenAPISpec from './OpenAPISpec';
import TransactionGraph, { FixtureTransactionAdjacencyList, TransactionGraphEdge } from './TransactionGraph';
import TransactionUtils from './TransactionUtils';

// transaction names can be obtained by running `npx dredd --names`
const transactionSlugToName: { [id: string]: string } = {};

const fixtures = new FixtureStore();
const logger = new Logger(hooks.log);
const utils = new TransactionUtils(fixtures, logger);

// Add delay between requests to prevent rate limiting (429 Too Many Requests)
const DELAY_BETWEEN_REQUESTS_MS = 100;
let lastRequestTime = 0;

hooks.beforeEach((transaction: Transaction): void => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < DELAY_BETWEEN_REQUESTS_MS) {
        const sleepTime = DELAY_BETWEEN_REQUESTS_MS - timeSinceLastRequest;
        // Synchronous sleep using busy-wait (not ideal but works for small delays)
        const start = Date.now();
        while (Date.now() - start < sleepTime) {
            // busy wait
        }
    }

    lastRequestTime = Date.now();
});

// all setup code for the tests run inside this beforeAll hook
hooks.beforeAll((transactions: Transaction[], done: () => void) => {
    // transactions listed here aren't included in the execution plan
    const preSkiplist = [
        // @todo fix team model to always return a created_by_user
        // fail: POST (201) /teams/881/invitations duration: 407ms
        //       body: At '/team/created_by_user' Missing required property: created_by_user
        'addTeamInvitation201',
        // The 'POST /projects' endpoint has been deprecated in favor of 'POST /@url-slug/projects',
        // so we skip it.
        'addProject201',
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
        'deleteTeamInvitation204',
        'rejectTeamInvitation204',
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
        'archiveEnvironment204',

        // All endpoints related to user management are deprecated and will be removed in future releases
        // So, we skip them for now
        'loginUser200',
        'updateUser204',

        // Skipping the deletion of resource 'containers' (organization, project, environment)
        // because the tests do not delete all created resources linked to them, causing
        // errors when trying to delete these resources
        'deleteOrganization204',
        'deleteProject204',
        'deleteEnvironment204',

        // For unlink some credential, needs to delete all resources linked to it, but some
        'unlinkCredentialFromEnvironment204',
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
        // deployServer: The server created in tests is self-hosted, but the API does not allow
        // server:deploy operations on self-hosted servers. This action can only be performed
        // on servers provisioned via Devopness.
        'deployServer204',
    ];

    // initial fixture-transaction graph definitions
    const initialFixtureTransactionAdjacencyList: FixtureTransactionAdjacencyList = {
        fixtureTransactionInputs: {
            // adding an application requires a valid server
            'server': ['addEnvironmentApplication201'],
            // a `login` transaction requires user credentials
            'user_login': ['loginUser200'],
            'organization': ['addOrganizationCredential201'],
        },
        fixtureTransactionOutputs: {
            'credential_cloud_provider': ['addEnvironmentNetwork201', 'linkCredentialToEnvironment204'],
            'credential_source_provider': ['addEnvironmentApplication201', 'linkCredentialToEnvironment204'],
            'credential': ['addOrganizationCredential201'],

            'organization': ['addOrganization201'],
            'personal_access_token': ['addUserPersonalAccessToken201'],

            // `user`, `user_credentials` and `user_login` are available after successful
            // `addUser202` transaction, which hardcodes values for those two
            // fixtures, replacing the value defined on `fixtureTypes.ts`
            'user': ['addUser202'],
            'user_credentials': ['addUser202'],
            'user_login': ['addUser202'],
            'user_token': ['addUser202'],

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
        ['addUserPersonalAccessToken201', 'listUserPersonalAccessTokens200'],
        ['addUserPersonalAccessToken201', 'getUserPersonalAccessToken200'],
        // credentials must be created before linking to environment
        ['addOrganizationCredential201', 'linkCredentialToEnvironment204'],
        // credentials must be linked before resources can use them
        ['linkCredentialToEnvironment204', 'addEnvironmentApplication201'],
        ['linkCredentialToEnvironment204', 'applyTemplateEnvironmentApplication204'],
        ['applyTemplateEnvironmentApplication204', 'applyTemplateEnvironmentApplication201'],
        ['linkCredentialToEnvironment204', 'addEnvironmentNetwork201'],
        ['linkCredentialToEnvironment204', 'addEnvironmentServer201'],
        // variable tests should run before deleteApplication
        ['deleteHook204', 'deletePipeline204'],
        ['deleteHook204', 'deleteApplication204'],
        ['deleteVariable204', 'deleteApplication204'],
        ['deleteVariable204', 'deleteService204'],
        ['triggerHook202', 'deleteApplication204'],
        ['addVariable201', 'deleteServer204'],
        // unlinkServerFromEnvironment requires deleting the associated ssh key, network rule, daemon, service, cron job and application
        ['deleteSshKey204', 'unlinkServerFromEnvironment204'],
        ['deleteNetworkRule204', 'unlinkServerFromEnvironment204'],
        ['deleteDaemon204', 'unlinkServerFromEnvironment204'],
        ['deleteService204', 'unlinkServerFromEnvironment204'],
        ['deleteCronJob204', 'unlinkServerFromEnvironment204'],
        ['deleteApplication204', 'unlinkServerFromEnvironment204'],
        // unlinkCredentialFromEnvironment requires deleting resources that use the credential
        ['deleteApplication204', 'unlinkCredentialFromEnvironment204'],
        ['deleteNetwork204', 'unlinkCredentialFromEnvironment204'],
        // deleteEnvironment requires an environment without linked servers
        ['unlinkServerFromEnvironment204', 'deleteEnvironment204'],
        ['deletePipeline204', 'deleteEnvironment204'],
        ['deleteHook204', 'deleteEnvironment204'],
        ['linkStepToPipeline204', 'unlinkStepFromPipeline204'],
        ['unlinkStepFromPipeline204', 'deletePipeline204'],
        ['addPipeline201', 'listPipelinesByResourceType200'],
        ['addEnvironmentApplication201', 'linkResourceLinkToResourceLink204'],
        ['linkResourceLinkToResourceLink204', 'unlinkResourceLinkFromResourceLink204'],
        ['addEnvironmentDaemon201', 'linkResourceLinkToResourceLink204'],
        ['getService200', 'getStatusService204'],
        ['deleteOrganization204', 'addOrganization201'],
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
        const user = {
          id: env.DEVOPNESS_USER_ID,
          url_slug: env.DEVOPNESS_USER_URL_SLUG,
        } as User;

        fixtures.put('user', user);
        fixtures.put('user_credentials', user);
        fixtures.put('user_token', { token: env.DEVOPNESS_PERSONAL_ACCESS_TOKEN });

        transaction.skip = true;
    });

    before('getUser200', (transaction: Transaction) => {
        const user = fixtures.get<User>('user');

        const oldPath = transaction.fullPath;
        transaction.fullPath = `/users/${user?.url_slug}`;
        transaction.id = `${transaction.request.method} (${transaction.expected.statusCode}) ${transaction.fullPath}`;

        hooks.log(`:: rewriting request path '${oldPath}' => '${transaction.fullPath}'`);
    })

    before('addOrganization201', utils.rewriteTransactionRequestBody((body: any) => {
        const timestamp = new Date().getTime();
        const orgName = `API Org ${timestamp}`;
        // Ensure name is max 30 chars for url_slug generation
        body['name'] = orgName.substring(0, 30);
        delete body['url_slug'];
    }));

    //// servers

    const beforeCreateServer = (transaction: Transaction) => {
        const tag = `[fake-server]`
        if (transaction.request.body) {
            const body = JSON.parse(transaction.request.body);
            if (body.hostname) {
                transaction.request.body = "";
                const environment = fixtures.get<Identifiable>('environment');
                if (environment) {
                    const path = `/internal/test-fixtures/server-fixture`;
                    hooks.log(`${tag} rewrite path '${transaction.fullPath}' => '${path}'`);
                    transaction.fullPath = path;
                    transaction.request.body = JSON.stringify({
                        environment_id: environment.id,
                    });
                } else {
                    hooks.log(`${tag} transaction '${transaction.id}' requires 'environment' fixture`);
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
    before('addProject201', utils.rewriteTransactionRequestBody((body: any) => {
      delete body['organization_id'];
    }));
    before('updateProject204', utils.rewriteTransactionRequestBody(randomizeName));

    before('addEnvironmentApplication201', utils.rewriteTransactionRequestBody((body: any) => {
        const credential = fixtures.get<Identifiable>('credential_source_provider');

        body['entrypoint'] = 'index.html'
        body['credential_id'] = credential?.id ?? body.credential_id
    }))

    before('updateApplication204', utils.rewriteTransactionRequestBody((body: any) => {
        const credential = fixtures.get<Identifiable>('credential_source_provider');

        body['entrypoint'] = 'index.html'
        body['credential_id'] = credential?.id ?? body.credential_id
    }))

    const addValidExpiresAt = (body: any) => {
        body['expires_at'] = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    }

    before('addProjectApiToken201', utils.rewriteTransactionRequestBody(addValidExpiresAt))
    before('addUserPersonalAccessToken201', utils.rewriteTransactionRequestBody(addValidExpiresAt))
    before('rotateProjectApiToken200', utils.rewriteTransactionRequestBody(addValidExpiresAt))
    before('rotateUserPersonalAccessToken200', utils.rewriteTransactionRequestBody(addValidExpiresAt))

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

    // This function modifies the request to create a credential using a fake
    // endpoint. This is necessary because credentials are validated by providers,
    // so we need to create fake credentials to be used by other endpoints.
    const beforeCreateCredential = (transaction: Transaction) => {
        const tag = `[fake-credentials]`

        const organization = fixtures.get<Identifiable>('organization');
        if (!organization) {
          hooks.log(`${tag} transaction '${transaction.id}' requires 'organization' fixture`);
          return;
        }

        transaction.expected.body = "";
        transaction.expected.bodySchema = {};

        transaction.fullPath = `/internal/test-fixtures/credential-fixture`;

        transaction.request.body = JSON.stringify({
          organization_id: organization.id,
          cloud: {
            name: "fake-cloud-credential",
            access_key: env.CREDENTIAL_AWS_ACCESS_KEY_ID,
            secret_key: env.CREDENTIAL_AWS_SECRET_ACCESS_KEY,
          },
          source: {
            name: "fake-source-credential",
            access_token: env.CREDENTIAL_GITHUB_ACCESS_TOKEN,
            provider_code: "github",
          },
        });

        hooks.log(`:: ${tag} creating credentials...`);
    }

    // After creating credentials, we need to save them in the fixture.
    // The endpoint returns two credentials: one for the source provider
    // and another for the cloud provider. The first one in the array is the cloud-
    // provider credential, which is also used to update the credential.
    const afterCreateCredential = (transaction: Transaction) => {
        const tag = `[fake-credentials]`
        const credentials = JSON.parse(transaction.real.body);

        fixtures.put("credential", { id: credentials[0].id });

        fixtures.put("credential_cloud_provider",  { id: credentials[0].id });
        fixtures.put("credential_source_provider", { id: credentials[1].id });

        hooks.log(`:: ${tag} saved credentials...`);
    }

    before('addOrganizationCredential201', beforeCreateCredential)
    after('addOrganizationCredential201', afterCreateCredential)

    before('applyTemplateEnvironmentApplication201', (transaction: Transaction) => {
        const tag = `[apply-template]`;
        const credential = fixtures.get<Identifiable>('credential_source_provider');

        hooks.log(`${tag} configuring template inputs...`);

        // Set the template ID and template inputs
        transaction.request.body = JSON.stringify({
            template_id: 'n8n',
            template_inputs: {
                source_credential_id: credential?.id,
                domain_name: 'n8n.devopness.com',
                daemon_name: 'n8n-runtime',
                postgres_password: 'password',
            }
        })

        hooks.log(`${tag} template inputs configured...`);
    })

    before('applyTemplateEnvironmentApplication204', (transaction: Transaction) => {
        const tag = `[apply-template-dry-run]`;
        const credential = fixtures.get<Identifiable>('credential_source_provider');

        hooks.log(`${tag} configuring template inputs...`);

        // Set the template ID, template inputs, and dry-run flag
        transaction.request.body = JSON.stringify({
            template_id: 'n8n',
            dry_run: true,
            template_inputs: {
                source_credential_id: credential?.id,
                domain_name: 'n8n.devopness.com',
                daemon_name: 'n8n-runtime',
                postgres_password: 'password',
            }
        })

        hooks.log(`${tag} template inputs configured...`);
    })

    // //// repositories
    before('getCredentialRepository200', (transaction: Transaction) => {
        const credential = fixtures.get<Identifiable>('credential_source_provider');

        transaction.fullPath = `/credentials/${credential?.id}/repositories/devopness/devopness`
    })

    //// applications
    // delete the leftover default application using manual API calls
    const wait = (secs: number) => {
        const waitTill = new Date(new Date().getTime() + secs * 1000);
        while (waitTill > new Date()) { }
    }
    after('deleteApplication204', (transaction: Transaction) => {
        const authToken = fixtures.get<PersonalAccessToken>('user_token');
        const project = fixtures.get<Identifiable>('project');
        if (authToken && authToken.token && project) {
            const host = transaction.host;
            const api = new DevopnessAPI(host, authToken.token, hooks.log);
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
            cloud_service_code: 'aws-ec2',
            settings: {
                region: 'us-east-1',
                cidr_block: '10.0.0.0/24',
            },
        };
    }))

    before('updateCredential204', utils.rewriteTransactionRequestBody((body: any) => {
        // Removed the `settings` field so that only the credential name is updated
        delete body.settings
    }))

    // Link BOTH credentials (cloud + source) to the environment
    // The linkCredentialToEnvironment204 transaction only accepts one credential_id at a time,
    // but we need both credentials linked before addEnvironmentApplication201 can succeed
    after('linkCredentialToEnvironment204', (transaction: Transaction) => {
        const tag = `[link-both-credentials]`;
        const authToken = fixtures.get<PersonalAccessToken>('user_token');
        const environment = fixtures.get<Identifiable>('environment');
        const credentialCloud = fixtures.get<Identifiable>('credential_cloud_provider');
        const credentialSource = fixtures.get<Identifiable>('credential_source_provider');

        if (!authToken || !authToken.token || !environment || !credentialCloud || !credentialSource) {
            hooks.log(`${tag} missing required fixtures`);
            return;
        }

        const host = transaction.host;
        const api = new DevopnessAPI(host, authToken.token, hooks.log);

        // Link the second credential (the transaction already linked the first one)
        // Since linkCredentialToEnvironment204 uses credential fixture by default,
        // we need to link the other credential type manually
        const firstCredentialId = transaction.fullPath.match(/\/credentials\/(\d+)\//)?.[1];
        const secondCredentialId = firstCredentialId === credentialCloud.id.toString()
            ? credentialSource.id
            : credentialCloud.id;

        hooks.log(`${tag} linking second credential ${secondCredentialId} to environment ${environment.id}`);
        const success = api.linkCredentialToEnvironment(environment.id, secondCredentialId);
        if (!success) {
            hooks.log(`${tag} failed to link second credential`);
        }
    })

    before('listPipelinesByResourceType200', utils.rewriteTransactionRequestUriResourceId(['application']));
    before('addPipeline201', utils.rewriteTransactionRequestUriResourceId(['application']));
    before('unlinkResourceLinkFromResourceLink204', utils.rewriteTransactionRequestUriResourceId(['application']));
    before('linkResourceLinkToResourceLink204', utils.rewriteTransactionRequestUriResourceId(['application', 'daemon']));
    before('addVariable201', utils.rewriteTransactionRequestUriResourceId(['server']));

    before('addEnvironmentApplication201', utils.removeLinkedResourcesFromRequestBody);
    before('addEnvironmentCronJob201', utils.removeLinkedResourcesFromRequestBody);
    before('addEnvironmentDaemon201', utils.removeLinkedResourcesFromRequestBody);
    before('addEnvironmentNetworkRule201', utils.removeLinkedResourcesFromRequestBody);
    before('addEnvironmentService201', utils.removeLinkedResourcesFromRequestBody);
    before('addEnvironmentSshKey201', utils.removeLinkedResourcesFromRequestBody);
    before('addEnvironmentVirtualHost201', utils.removeLinkedResourcesFromRequestBody);

    // Ensure resource-server links are removed before running tests.
    //
    // In the API Docs Build, tests do not run on a real server.
    //
    // As a result, resource deletions are not actually executed,
    // leading to stale data in the database.
    //
    // Other tests assume that resources are properly deleted
    // when delete action tests are executed.
    //
    // Removing the link prevents a delete action from being created,
    // ensuring the resource is immediately removed from the database.
    // This allows subsequent tests to run correctly.

    before('deleteDaemon204', (transaction: Transaction) => {
      utils.removeLinkWithServer(transaction, 'daemon');
    });

    before('deleteService204', (transaction: Transaction) => {
      utils.removeLinkWithServer(transaction, 'service');
    });

    done();
})
