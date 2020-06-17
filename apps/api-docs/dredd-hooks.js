/**
 * @todo: assume an empty database before running this (i.e always run
 * `/db-reset` before running this script) ?
 *
 * @todo: implement basic `sign-up/login/logout` flow
 *
 * @todo: we can increment it by after sign-up and login create a project and a server inside a project,
 * assuming a default project environment for the server
 */
const uuid = require('uuid');
const hooks = require('hooks');

// transaction names can be obtained by running `npx dredd --names`
const transactionNames = {
    'users-signup': 'Users > /users > Sign up/register a new user > 201',
    'users-login': 'Users > /users/login > Login/create a new token for the given credentials > 200 > application/json; charset=utf-8',
    'users-logout': 'Users > /users/logout > Logout/revoke an existing token > 204',
    'users-refresh-token': 'Users > /users/refresh-token > Refresh an existing user access token > 200 > application/json; charset=utf-8',
};

// transactionOrder specifies which methods will run in which order
const transactionOrder = [
    'users-signup',
    'users-login',
    'users-refresh-token',
    'users-logout'
].map(k => transactionNames[k]);

const after = (id, cb) => hooks.after(transactionNames[id], cb);
const before = (id, cb) => hooks.before(transactionNames[id], cb);

// define which transactions will be ran and in which order
// inspired by https://github.com/apiaryio/dredd/issues/456
hooks.beforeAll((transactions, done) => {
    let keep = [];
    for (transaction of transactions) {
        const idx = transactionOrder.indexOf(transaction.name);
        if (idx > -1) {
            keep[idx] = transaction;
        }
    }
    transactions.splice(0, transactions.length);
    for (i in keep) {
        transactions.push(keep[i])
    }
    done();
})

const fixtures = {};
const getFixture = (key) => fixtures[key];
const putFixture = (key, value) => {
    // hooks.log(`storing fixture "${key}": ${value}`);
    fixtures[key] = value;
};
const deleteFixture = (key) => {
    // hooks.log(`deleting fixture "${key}"`);
    delete fixtures[key];
};

const storeFixtureFromTx = (key) => (transaction) => {
    if (transaction.results.valid && transaction.real.body) {
        const data = JSON.parse(transaction.real.body);
        putFixture(key, data);
    }
};

hooks.beforeEach((transaction) => {
    // attach auth header if request requires it
    if(transaction.request.headers.hasOwnProperty('Authorization')) {
        if (transaction.request.headers.Authorization === '') {
            const authToken = getFixture('authToken');
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

before('users-signup', (transaction) => {
    const email = `${uuid.v1()}@api-test.devopness`;
    const password = uuid.v4();
    const credentials = { email, password } ;

    transaction.request.body = JSON.stringify(credentials);
    putFixture('userCredentials', credentials);
})

// after('users-signup', storeFixtureFromTx('user'));

before('users-login', (transaction) => {
    const user = getFixture('userCredentials');
    if (user) {
        const credentials = { email: user.email, password: user.password } ;
        transaction.request.body = JSON.stringify(credentials);
    } else {
        hooks.log(`transaction '${transaction.id}' requires 'userCredentials' fixture; skipping`)
        transaction.skip = true;
    }
});
after('users-login', storeFixtureFromTx('authToken'));

before('users-refresh-token', (transaction) => {
    const authToken = getFixture('authToken');
    if (authToken && authToken.refresh_token) {
        const body = JSON.parse(transaction.request.body);
        body.refresh_token = authToken.refresh_token;
        transaction.request.body = JSON.stringify(body);
    } else {
        hooks.log(`'${transaction.id}' requires 'authToken' fixture; skipping`)
        transaction.skip = true;
    }
});
after('users-refresh-token', storeFixtureFromTx('authToken'));

after('users-logout', (transaction) => {
    if (transaction.results.valid) {
        deleteFixture('authToken');
    }
});
