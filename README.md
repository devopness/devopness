# Devopness SDK - JavaScript

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/devopness/devopness/sdk-js/blob/master/LICENSE)
![CI](https://github.com/devopness/sdk-js/workflows/CI/badge.svg)

[![NPM](https://nodei.co/npm/sdk-js.png?downloads=true&stars=true)](https://nodei.co/npm/@devopness/sdk-js/)

The official Devopness SDK for JavaScript, available for browsers, mobile devices and `Node.js` backends.

The `Devopness` SDK provides convenient access to the `Devopness` API from applications written in the JavaScript language. It includes a pre-defined set of classes for API resources and aims to make it easy and fun to consume `Devopness` API from web apps, Node.js apps, or mobile apps written in the JavaScript language.

## About Devopness
`Devopness` aims to drastically change the way software developers deploy applications and manage on-premise and cloud servers in a secure and performant fashion.

By streamlining essential DevOps practices we're making first class software deployment and server management tools accessible and affordable to every developer in the world.

## Usage

### Installation
Use `npm` to install the Devopness SDK package as a dependency of your project:
```
npm install @devopness/sdk-js@latest
```

### Upgrade
To upgrade the Devopness SDK npm package to the latest version, add the `@latest` suffix to the package name:
```
npm install @devopness/sdk-js@latest
```
### Initializing

To initialize the usage of Devopness SDK just import it and create a new instance of `DevopnessApiClient` class.

Here is a generic simple example that can be used from `Node.js`, `TypeScript` or `Javascript` applications:

```javascript
import { DevopnessApiClient } from '@devopness/sdk-js'
const devopnessApi = new DevopnessApiClient();
```

### Authenticating

To authenticate, just invoke the `login` method on the `users` service:

```javascript
async function authenticate(email, pass) {
  const userTokens = await devopnessApi.users.login({ email: email, password: pass });
  // The `accessToken` must be set every time a token is obtained or refreshed.
  devopnessApi.accessToken = userTokens.data.access_token;
}

// invoke the authentication method
authenticate('user@email.com', 'secret-password');
```

### Invoking authentication protected endpoints
Once an authentication token is set, any protected endpoint can be invoked.
Example retrieving current user details:

```javascript
async function getUserProfile() {
    // invoke the authentication method to ensure an auth token
    // is retrieved and set to the SDK instance
    await authenticate('user@email.com', 'secret-password');

    // Now that we're authenticated, we can invoke methods on any services.
    // Here we're invoking the `getCurrentUser()` method on the `users` service
    const currentUser = await devopnessApi.users.getCurrentUser();
    console.log('Successfully retrieved user profile: ', currentUser);
}

getUserProfile();
```


### TypeScript support
This package includes TypeScript declarations for every method.
TypeScript versions >= 3.1 are supported.

Some methods in `Devopness SDK JavaScript` accept and return objects from the Devopness API. The type declarations for these objects will always track the latest version of the API. Therefore, if you'e using the latest version of this package you can rely on the Devopness API documentation for checking the input and return types of each API endpoint.
