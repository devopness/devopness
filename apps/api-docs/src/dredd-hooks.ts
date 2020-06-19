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

// define which transactions will be ran and in which order
// inspired by https://github.com/apiaryio/dredd/issues/456
hooks.beforeAll((transactions, done) => {
    let keep = [];
    for (const transaction of transactions) {
        const idx = transactionOrder.indexOf(transaction.name);
        if (idx > -1) {
            keep[idx] = transaction;
        }
    }
    transactions.splice(0, transactions.length);
    for (const i in keep) {
        transactions.push(keep[i]);
    }
    done();
})

// only fields that are accessed directly by hooks are required to be typed here
interface Identifiable {
    id: string
}
type UserCredentials = {
    email: string
    password: string
};
type AuthToken = {
    access_token: string
    refresh_token: string
};
type Fixture = UserCredentials | AuthToken | Identifiable;

// fixture keys are written with underscores so they map directly to URL and JSON param names
type FixtureKey = 'user_credentials' | 'auth_token' | 'project' | 'ssh_key'

const fixtures: { [key: string]: Fixture } = {};
function getFixture<T extends Fixture>(key: FixtureKey): T | null {
    if (!(key as FixtureKey)) {
        hooks.log(`invalid fixture key "${key}"`);
    }
    const typed = fixtures[key] as T;
    if (typed) {
        return typed;
    }
    hooks.log(`missing fixture "${key}"`);
    return null;
}
function putFixture(key: FixtureKey, value: Fixture) {
    // hooks.log(`storing fixture "${key}": ${JSON.stringify(value)}`);
    fixtures[key] = value;
};
function deleteFixture(key: FixtureKey) {
    // hooks.log(`deleting fixture "${key}"`);
    delete fixtures[key];
};

function storeFixtureFromTestResult<T>(key: FixtureKey): TransactionHook {
    return (transaction: Transaction) => {
        if (transaction.test.valid && transaction.real.body) {
            const data = JSON.parse(transaction.real.body);
            const typed = (data as T);
            if (typed) {
                putFixture(key, data);
            } else {
                hooks.log(`Couldn't save fixture '${key}', wrong datatype: '${JSON.stringify(data)}'`);
            }
        };
    };
};

// replaces `${fixtureKey}_id` with ${fixture.id} in transaction request path
function renderFixtureIdInTransactionPath<T extends Fixture & Identifiable>(fixtureKey: FixtureKey) {
    return (transaction: Transaction) => {
        const fixture = getFixture<T>(fixtureKey);
        if (fixture) {
            const replacedPath = transaction.origin.resourceName.replace(`{${fixtureKey}_id}`, fixture.id);
            transaction.fullPath = replacedPath;
        } else {
            hooks.log(`transaction '${transaction.id}' requires '${fixtureKey}' fixture; skipping`)
            transaction.skip = true;
        }
    }
};

hooks.beforeEach((transaction: Transaction) => {
    if (!transaction.request.headers) {
        return;
    }

    // attach auth header if request requires it
    if(transaction.request.headers.hasOwnProperty('Authorization')) {
        if (transaction.request.headers.Authorization === '') {
            const authToken = getFixture<AuthToken>('auth_token');
            if (authToken && authToken.access_token) {
                transaction.request.headers.Authorization = 'Bearer ' + authToken.access_token;
            } else {
                hooks.log(`'${transaction.id}' requires 'authToken' fixture; skipping`)
            }
        }
    }
    transaction.request.headers['Content-Type'] = 'application/json';
    transaction.request.headers.Accept = 'application/json';
});

///////////////////////////////////////////////////////////////////////////////
// users
///////////////////////////////////////////////////////////////////////////////

before('users-signup', (transaction: Transaction) => {
    // randomize user, as db state won't be clean
    const email = `${v1()}@api-test.devopness`;
    const password = v4();
    const credentials: UserCredentials = { email, password } ;

    transaction.request.body = JSON.stringify(credentials);
    putFixture('user_credentials', credentials);
})

before('users-login', (transaction: Transaction) => {
    const user = getFixture<UserCredentials>('user_credentials');
    if (user) {
        const credentials = { email: user.email, password: user.password } ;
        transaction.request.body = JSON.stringify(credentials);
    } else {
        hooks.log(`transaction '${transaction.id}' requires 'userCredentials' fixture; skipping`)
        transaction.skip = true;
    }
});
after('users-login', storeFixtureFromTestResult('auth_token'));

before('users-refresh-token', (transaction: Transaction) => {
    const authToken = getFixture<AuthToken>('auth_token');
    if (authToken && transaction.request.body) {
        const body = JSON.parse(transaction.request.body);
        body.refresh_token = authToken.refresh_token;
        transaction.request.body = JSON.stringify(body);
    } else {
        hooks.log(`'${transaction.id}' requires 'authToken' fixture; skipping`)
        transaction.skip = true;
    }
});
after('users-refresh-token', storeFixtureFromTestResult('auth_token'));

after('users-logout', (transaction: Transaction) => {
    if (transaction.test.valid) {
        deleteFixture('auth_token');
    }
});


///////////////////////////////////////////////////////////////////////////////
// projects
///////////////////////////////////////////////////////////////////////////////

function removeLogoImage(transaction: Transaction) {
    if (transaction.request.body) {
        const body = JSON.parse(transaction.request.body);
        if (body.hasOwnProperty('logo_image')) {
            delete body['logo_image'];
        }
        transaction.request.body = JSON.stringify(body);
    }
}

before('projects-create', removeLogoImage);
after('projects-create', storeFixtureFromTestResult('project'));

before('projects-get', removeLogoImage);
before('projects-get', renderFixtureIdInTransactionPath<Identifiable>('project'));

///////////////////////////////////////////////////////////////////////////////
// projects - ssh-keys
///////////////////////////////////////////////////////////////////////////////

before('projects-ssh-keys-create', renderFixtureIdInTransactionPath<Identifiable>('project'));
after('projects-ssh-keys-create', storeFixtureFromTestResult('ssh_key'));

///////////////////////////////////////////////////////////////////////////////
// ssh-keys
///////////////////////////////////////////////////////////////////////////////

before('ssh-keys-get', renderFixtureIdInTransactionPath('ssh_key'));
