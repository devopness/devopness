# Devopness SDK - JavaScript

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/devopness/devopness-api-sdk-js/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/devopness-sdk-js.png?downloads=true&stars=true)](https://nodei.co/npm/devopness-sdk-js/)

The official Devopness SDK for JavaScript, available for browsers, mobile devices and `Node.js` backends.

The `Devopness` SDK provides convenient access to the `Devopness` API from applications written in the JavaScript language. It includes a pre-defined set of classes for API resources and aims to make it easy and fun to consume `Devopness` API from web apps, Node.js apps, or mobile apps written in the JavaScript language.

## About Devopness
`Devopness` aims to drastically change the way software developers deploy applications and manage on-premise and cloud servers in a secure and performant fashion.

By streamlining essential DevOps practices we're making first class software deployment and server management tools accessible and affordable to every developer in the world.

This project is the `Devopness` frontend web application.

## Setup
Use `npm` or `yarn` to install the `Devopness SDK` as a project dependency:
- Using `npm`: `npm install devopness-sdk-js`
- Using `yarn`: `yard add devopness-sdk-js`

## Usage

### TypeScript support
This package includes TypeScript declarations for every method.
TypeScript versions >= 3.1 are supported.

Some methods in `Devopness SDK JavaScript` accept and return objects from the Devopness API. The type declarations for these objects will always track the latest version of the API. Therefore, if you'e using the latest version of this package you can rely on the Devopness API documentation for checking the input and return types expected by each API endpoint.

### Initializing and authenticating

Here is a generic simple example that can be used from `Node.js`, `TypeScript` or `Javascript` applications:

```javascript
var devopnessSdkJs = require("devopness-sdk-js")

const DEVOPNESS_API_BASE_URL = 'https://dev-api.devopness.com';
const devopnessApi = new devopnessSdkJs.DevopnessApiClient({ baseUrl: DEVOPNESS_API_BASE_URL });

async function authenticateAndGetUserProfile(email, pass) {
  var userCredentials = {
    email: email,
    password: pass,
  };

  try {
    const userTokens = await devopnessApi.users.login(userCredentials);
    // after logging in, tell the api to use the newly received `accessToken`.
    // This accessToken must be replaced every time a token refresh is
    // performed, and it will be automatically cleaned up when
    // invoking `devopnessApi.users.logout`
    devopnessApi.accessToken = userTokens.access_token;
    // optionally: store the token in any storage for further re-usage
    // localStorage.setItem('devopness-api::access_token', userTokens.access_token)
    // localStorage.setItem('devopness-api::refresh_token', userTokens.refresh_token)

    // now that we're authenticated, we can invoke any of the available API client methods
    const currentUser = await devopnessApi.users.getCurrentUser();
    console.log('Successfully retrieved user details: ', currentUser);

  } catch (error) {
    console.log('Error on user authentication: ', JSON.stringify(error.response.data));
  };
}

// invoke the authentication method
authenticateAndGetUserProfile('user@email.com', 'secret-password');

```
