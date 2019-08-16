var hooks = require('hooks');
var testStash = {
    acessToken: null,
    refreshToken: null
};

// transaction names can be obtained by running `dredd --names`
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
        hooks.log("\nNew tokens retrieved:\n");
    }
}

hooks.beforeEach(function(transaction) {
    // hooks.log('Executing hook "beforeEach" for transaction "' + transaction.name + '"');
    if(transaction.request.headers['Authorization'] != undefined) {
        // transaction requires Authorization header, according to documentation
        if (transaction.request.headers.Authorization == '' && testStash.accessToken != null) {
            transaction.request.headers.Authorization = 'Bearer ' + testStash.accessToken;
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
        "email": "blabla@umdeia.com",
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
