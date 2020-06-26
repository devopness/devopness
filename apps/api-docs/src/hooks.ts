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

import { Identifiable, UserCredentials, AuthToken, isFixtureKey } from './fixtureTypes';
import FixtureStore  from './FixtureStore';
import TransactionUtils from './TransactionUtils';

// transaction names can be obtained by running `npx dredd --names`
const transactionNames: { [id: string]: string } = {
    // users
    'users-signup': 'Users > /users > Sign up/register a new user > 201',
    'users-login': 'Users > /users/login > Login/create a new token for the given credentials > 200 > application/json; charset=utf-8',
    'users-logout': 'Users > /users/logout > Logout/revoke an existing token > 204',
    'users-refresh-token': 'Users > /users/refresh-token > Refresh an existing user access token > 200 > application/json; charset=utf-8',
    // projects
    'projects-create': 'Projects > /projects > Create a new project > 201',
    'projects-get': 'Projects > /projects/{project_id} > Get a project by ID > 200 > application/json',
    // projects - ssh-keys
    'projects-ssh-keys-create': 'Projects - SSH Keys > /projects/{project_id}/ssh-keys > Create a SSH key and link it to the given project > 201 > application/json',
    // ssh-keys
    'ssh-keys-get': 'SSH Keys > /ssh-keys/{ssh_key_id} > Get a SSH key by ID > 200 > application/json',
};

// transactionOrder specifies which methods will run in which order
const transactionOrder: string[] = [
    'users-signup',
    'users-login',
    'users-refresh-token',
    'projects-create',
    'projects-get',
    'projects-ssh-keys-create',
    'ssh-keys-get',
    'users-logout'
].map(k => transactionNames[k]);

const after = (id: string, cb: TransactionHook) => hooks.after(transactionNames[id], cb);
const before = (id: string, cb: TransactionHook) => hooks.before(transactionNames[id], cb);

const fixtures = new FixtureStore();
const utils = new TransactionUtils(fixtures, hooks.log);

hooks.beforeAll((transactions: Transaction[], done: () => void) => {
    utils.selectTransactionsByName(transactions, transactionOrder);
    transactions.forEach((transaction: Transaction) => {
        // transaction requires a fixture id
        const idPattern = /{([a-zA-Z_]+)_id}/g;
        let idParamMatch = idPattern.exec(transaction.origin.resourceName);
        while (idParamMatch) {
            const paramType = idParamMatch[1];
            if (isFixtureKey(paramType)) {
                hooks.before(transaction.name, utils.writeFixtureIdInTransactionPath(paramType));
            } else {
                hooks.log(`[beforeAll] can't ${paramType} is not a valid fixture key`);
            }
            idParamMatch = idPattern.exec(transaction.origin.resourceName);
        }
    });
    done();
})

hooks.beforeEach(utils.setTransactionRequestAuthHeaderWithFixture('auth_token'));
hooks.beforeEach(utils.setTransactionRequestJsonHeaders);

///////////////////////////////////////////////////////////////////////////////
// users
///////////////////////////////////////////////////////////////////////////////

// randomize user, as db state won't be clean
before('users-signup', (transaction: Transaction) => {
    const credentials = { email: `${v1()}@api-test.devopness`, password: v4() }
    transaction.request.body = JSON.stringify(credentials);
    fixtures.put('user_credentials', credentials);
})

before('users-login', utils.setTransactionRequestBodyToFixture<UserCredentials>('user_credentials'));
after('users-login', utils.storeTransactionResult('auth_token'));

before('users-refresh-token', utils.setTransactionRequestBodyToFixture<AuthToken>('auth_token'));
after('users-refresh-token', utils.storeTransactionResult('auth_token'));

after('users-logout', (transaction: Transaction) => {
    if (transaction.test.valid) {
        fixtures.delete('auth_token');
    }
});

///////////////////////////////////////////////////////////////////////////////
// projects
///////////////////////////////////////////////////////////////////////////////

const removeLogoImage = (body: any) => { delete body['logo_image']; }

before('projects-create', utils.rewriteTransactionRequestBody(removeLogoImage));
after('projects-create', utils.storeTransactionResult('project'));

before('projects-get', utils.rewriteTransactionRequestBody(removeLogoImage));

///////////////////////////////////////////////////////////////////////////////
// projects - ssh-keys
///////////////////////////////////////////////////////////////////////////////

after('projects-ssh-keys-create', utils.storeTransactionResult('ssh_key'));

///////////////////////////////////////////////////////////////////////////////
// ssh-keys
///////////////////////////////////////////////////////////////////////////////
