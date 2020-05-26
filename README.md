# Devopness SDK - JavaScript

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/devopness/devopness/sdk-js/blob/master/LICENSE)
![CI](https://github.com/devopness/sdk-js/workflows/CI/badge.svg)

[![NPM](https://nodei.co/npm/sdk-js.png?downloads=true&stars=true)](https://nodei.co/npm/@devopness/sdk-js/)

The official Devopness SDK for JavaScript, available for browsers, mobile devices and `Node.js` backends.

The `Devopness` SDK provides convenient access to the `Devopness` API from applications written in the JavaScript language. It includes a pre-defined set of classes for API resources and aims to make it easy and fun to consume `Devopness` API from web apps, Node.js apps, or mobile apps written in the JavaScript language.

## About Devopness
`Devopness` aims to drastically change the way software developers deploy applications and manage on-premise and cloud servers in a secure and performant fashion.

By streamlining essential DevOps practices we're making first class software deployment and server management tools accessible and affordable to every developer in the world.

## Setup
Use `npm` or `yarn` to install the Devopness SDK npm package as a project dependency:
- Using `npm`: `npm install @devopness/sdk-js`
- Using `yarn`: `yarn add @devopness/sdk-js`

## Usage

### TypeScript support
This package includes TypeScript declarations for every method.
TypeScript versions >= 3.1 are supported.

Some methods in `Devopness SDK JavaScript` accept and return objects from the Devopness API. The type declarations for these objects will always track the latest version of the API. Therefore, if you'e using the latest version of this package you can rely on the Devopness API documentation for checking the input and return types expected by each API endpoint.

### Initializing and authenticating

Here is a generic simple example that can be used from `Node.js`, `TypeScript` or `Javascript` applications:

```javascript
const { DevopnessApiClient } = require("@devopness/sdk-js")
const devopnessApi = new DevopnessApiClient();

async function authenticate(email, pass) {
  const userTokens = await devopnessApi.users.login({ email: email, password: pass });
  // The `accessToken` must be set every time a token is obtained or refreshed.
  devopnessApi.accessToken = userTokens.data.access_token;
}

async function getUserProfile() {
    const currentUser = await devopnessApi.users.getCurrentUser();
    console.log('Successfully retrieved user profile: ', currentUser);
}

// invoke the authentication method
authenticate('user@email.com', 'secret-password');
// Now that we're authenticated, retrieves the current user profile
getUserProfile();
```
