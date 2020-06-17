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
    'users-signup': 'Users > /users > Sign up/register a new user > 201',
    'users-login': 'Users > /users/login > Login/create a new token for the given credentials > 200 > application/json; charset=utf-8',
    'users-logout': 'Users > /users/logout > Logout/revoke an existing token > 204',
    'users-refresh-token': 'Users > /users/refresh-token > Refresh an existing user access token > 200 > application/json; charset=utf-8',
};

// transactionOrder specifies which methods will run in which order
const transactionOrder: string[] = [
    'users-signup',
    'users-login',
    'users-refresh-token',
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

type UserCredentials = {
    email: string,
    password: string
};
type AuthToken = {
    access_token: string,
    refresh_token: string
};
type Fixture = AuthToken | UserCredentials;

const fixtures: { [key: string]: Fixture } = {};
function getFixture<T extends Fixture>(key: string): T | null {
    const typed = fixtures[key] as T;
    if (typed) {
        return typed;
    }
    return null;
}
function putFixture(key: string, value: Fixture) {
    // hooks.log(`storing fixture "${key}": ${value}`);
    fixtures[key] = value;
};
function deleteFixture(key: string) {
    // hooks.log(`deleting fixture "${key}"`);
    delete fixtures[key];
};

function storeFixtureFromTestResult<T>(key: string): TransactionHook {
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

hooks.beforeEach((transaction: Transaction) => {
    if (!transaction.request.headers) {
        return;
    }

    // attach auth header if request requires it
    if(transaction.request.headers.hasOwnProperty('Authorization')) {
        if (transaction.request.headers.Authorization === '') {
            const authToken = getFixture<AuthToken>('authToken');
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
    putFixture('userCredentials', credentials);
})

before('users-login', (transaction: Transaction) => {
    const user = getFixture<UserCredentials>('userCredentials');
    if (user) {
        const credentials = { email: user.email, password: user.password } ;
        transaction.request.body = JSON.stringify(credentials);
    } else {
        hooks.log(`transaction '${transaction.id}' requires 'userCredentials' fixture; skipping`)
        transaction.skip = true;
    }
});
after('users-login', storeFixtureFromTestResult('authToken'));

before('users-refresh-token', (transaction: Transaction) => {
    const authToken = getFixture<AuthToken>('authToken');
    if (authToken && transaction.request.body) {
        const body = JSON.parse(transaction.request.body);
        body.refresh_token = authToken.refresh_token;
        transaction.request.body = JSON.stringify(body);
    } else {
        hooks.log(`'${transaction.id}' requires 'authToken' fixture; skipping`)
        transaction.skip = true;
    }
});
after('users-refresh-token', storeFixtureFromTestResult('authToken'));

after('users-logout', (transaction: Transaction) => {
    if (transaction.test.valid) {
        deleteFixture('authToken');
    }
});
