/**
 * @todo: assume an empty database before running this (i.e always run
 * `/db-reset` before running this script) ?
 *
 * @todo: implement basic `sign-up/login/logout` flow
 *
 * @todo: we can increment it by after sign-up and login create a project and a server inside a project,
 * assuming a default project environment for the server
 */
var hooks = require('hooks');
var testStash = {
    acessToken: null,
    refreshToken: null
};

// transaction names can be obtained by running `npx dredd --names`
const transactionNames = {
    'users-login': 'Users > /users/login > Login/create a new token for the given credentials > 200 > application/json; charset=utf-8',
    'users-logout': 'Users > /users/logout > Logout/revoke an existing token > 204',
    'users-refresh-token': 'Users > /users/refresh-token > Refresh an existing user access token > 200 > application/json; charset=utf-8',
    'users-signup': 'Users > /users/signup > Sign up/register a new user > 201 > application/json'
};

function updateTokens(transaction) {
    if (transaction.results.statusCode &&
        transaction.results.statusCode.valid &&
        transaction.results.body.valid &&
        transaction.results.body.valid) {
        var responseData = JSON.parse(transaction.results.body.values.actual);
        testStash.accessToken = responseData.access_token;
        testStash.refreshToken = responseData.refresh_token;
        // hooks.log("\nNew tokens retrieved:\n" + " accessToken: " + responseData.access_token);
    }
}

hooks.beforeEach(function(transaction) {
    // hooks.log('Executing hook "beforeEach" for transaction "' + transaction.name + '"');
    if(transaction.request.headers['Authorization'] != undefined) {
        // transaction requires Authorization header, according to documentation
        if (transaction.request.headers.Authorization == '') {
            if (testStash.accessToken == null) {
                // TO DO: should invoke request token, see git stash generated for tremtec
                // in the beginning of the project
                // updateTokens(transaction);
            }
            if (testStash.accessToken != null) {
                transaction.request.headers.Authorization = 'Bearer ' + testStash.accessToken;
            }
        }
    }
    transaction.request.headers['Content-Type'] = 'application/json';
    transaction.request.headers.Accept = 'application/json';
    // console.log(transaction.request);
});

// hooks.afterEach(function(transaction) {
//     if (!transaction.results.statusCode.valid ||
//         !transaction.results.headers.valid ||
//         !(transaction.results.body != undefined && transaction.results.body.valid)) {
//         hooks.log("Test failed. Full transaction results:\n");
//         console.log(transaction.results);
//     }
// });

hooks.before(transactionNames['users-login'], function(transaction) {
    // hooks.log('Executing hook "before" transaction "' + transactionNames['users-login'] + '"');

    var testCredentials = {
        "email": "blabla@test.com",
        "password": "algumasenha"
    };
    transaction.request.body = JSON.stringify(testCredentials);

    // console.log(transaction.request);
});

hooks.after(transactionNames['users-login'], function(transaction) {
    updateTokens(transaction);
});

hooks.before(transactionNames['users-logout'], function(transaction) {
    // skipping the logout API call for now, to avoid revoking the existing token
    // @todo: automatically detect endpoints that require authentication and call /login again?
    transaction.skip = true;
});

hooks.before(transactionNames['users-refresh-token'], function(transaction) {
    // hooks.log('Executing hook "before" transaction users-refresh-token');

    var body = JSON.parse(transaction.request.body);
    body.refresh_token = testStash.refreshToken;
    transaction.request.body = JSON.stringify(body);

    // console.log(transaction.request);
});

hooks.after(transactionNames['users-refresh-token'], function(transaction) {
    updateTokens(transaction);
});
