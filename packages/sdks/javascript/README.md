# Devopness SDK - JavaScript ><>

[![NPM](https://nodei.co/npm/@devopness/sdk-js.png?downloads=true&stars=true)](https://nodei.co/npm/@devopness/sdk-js/)

The official Devopness SDK for JavaScript, available for browsers, mobile devices and `Node.js` backends.

Devopness SDK includes a pre-defined set of classes that provide convenient access to Devopness platform data. This SDK aims to make it easy and fun to consume Devopness API resources from web, Node.js or mobile apps written in the JavaScript programming language.

## Usage

### Install/Upgrade
Use your favourite package manager to install Devopness SDK as a dependency of your project:
```bash
# Using npm
npm install @devopness/sdk-js

# Using yarn
yarn add @devopness/sdk-js
```

### Initializing

To initialize the usage of Devopness SDK, just import it and create a new instance of `DevopnessApiClient` class.

Here is a generic simple example that can be used from `Node.js`, `TypeScript` or `Javascript` applications:

```javascript
import { DevopnessApiClient } from '@devopness/sdk-js'
const devopnessApi = new DevopnessApiClient();
```

The instance of `DevopnessApiClient` has properties to all services provided by the API.
The name of the methods at services is the same as the operation name in the documentation of the
Devopness API. You can consult the URL of an endpoint to see the operation name. For instance,
the URL to endpoint `POST /users/login` in the documentation is: `/#operation/login`

### Authenticating

To authenticate, just invoke the `login` method on the `users` service:

```javascript
async function authenticate(email, pass) {
  const userTokens = await devopnessApi.users.loginUser({ email: email, password: pass });
  // The `accessToken` must be set every time a token is obtained or refreshed.
  devopnessApi.accessToken = userTokens.data.access_token;
}

// invoke the authentication method
authenticate('user@email.com', 'secret-password');
```

In the example above, `userTokens` is an instance of `ApiResponse` and the `data` property has the data requested from the API. See [ApiResponse.ts](https://github.com/devopness/devopness/blob/main/packages/sdks/javascript/src/common/ApiResponse.ts) for reference.

### Invoking authentication protected endpoints
Once an authentication token is set, any protected endpoint can be invoked.
Example retrieving current user details:

```javascript
async function getUserProfile() {
    // invoke the authentication method to ensure an auth token
    // is retrieved and set to the SDK instance
    await authenticate('user@email.com', 'secret-password');

    // Now that we're authenticated, we can invoke methods on any services.
    // Here we're invoking the `getUserMe()` method on the `users` service
    const currentUser = await devopnessApi.users.getUserMe();
    console.log('Successfully retrieved user profile: ', currentUser);
}

getUserProfile();
```

### TypeScript support
This package includes TypeScript declarations for every method.
TypeScript versions `>= 4.4` are supported.

>Some methods in `Devopness SDK JavaScript` accept and return objects from the Devopness API. The type declarations for these objects will always track the latest version of the API. Therefore, if you're using the latest version of this package, you can rely on the Devopness API documentation for checking the input and return types of each API endpoint.

## Development & Testing
To build and test the SDK locally, [**fork this repository**](https://github.com/devopness/devopness/fork) and follow these steps:

### With Docker
#### Pre-requisites
- [Docker](https://www.docker.com/products/docker-desktop/)
- [make](https://www.gnu.org/software/make/)
  - `make` is pre-installed in most Linux systems.
  - In `macOS` it is included as part of the `Xcode` command line utils. It can be installed with the following command:
  ```
  xcode-select --install
  ```
### Setup and run in local environment
#### 1. Navigate to the project directory
```shell
cd packages/sdks/javascript/
```

#### 2. Build Docker Image
```
make build-image
```

#### 3. Install Dependencies
```
make npm-ci
```

#### 4. Build SDK
```
make build-sdk-js
```

#### 5. Run Tests
```
make test
```

### Without Docker
Installing on ``Linux`` or ``macOS`` systems.

#### 1. Navigate to the project directory
```shell
cd packages/sdks/javascript/
```

#### 2. Install missing dependencies
This command will install all modules listed as dependencies in [package.json](package.json). **A working Java Runtime Environment is also required.** Please, check out the installation instructions
for your operating system.
```
npm install
```

#### 3. Build SDK
```
npm run build
```

#### 4. Run tests
```
npm run test
```
