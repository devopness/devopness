# Devopness SDK - JavaScript

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

### Authentication

#### Authentication with Personal Access Token

Ensure you have a Personal Access Token from Devopness. If you don't have one, see [Add a Personal Access Token](https://www.devopness.com/docs/api-tokens/personal-access-tokens/add-personal-access-token).

```javascript
import { DevopnessApiClient } from '@devopness/sdk-js'

// Option 1: Pass token during initialization
const devopnessApi = new DevopnessApiClient({
  apiToken: 'your-personal-access-token-here'
});

// Option 2: Set token after initialization
const devopnessApi = new DevopnessApiClient();
devopnessApi.apiToken = 'your-personal-access-token-here';

const currentUser = await devopnessApi.users.getUserMe();
```

#### Authentication with Project API Token

Ensure you have a Project API Token from Devopness. If you don't have one, see [Add a Project API Token](https://www.devopness.com/docs/api-tokens/project-api-tokens/add-project-api-token).

```javascript
import { DevopnessApiClient } from '@devopness/sdk-js'

const devopnessApi = new DevopnessApiClient({
  apiToken: 'your-project-api-token-here'
});

const project = await devopnessApi.projects.getProject(projectId);
```

#### Authentication with Login (Deprecated)

> **Warning:** Email/password authentication is no longer supported. API requests using this method return 4xx errors.

### Invoking authentication-protected endpoints

Once authenticated, you can invoke protected endpoints. Here's an example of retrieving user details and listing projects:

```javascript
import { DevopnessApiClient } from '@devopness/sdk-js'

const devopnessApi = new DevopnessApiClient({
  apiToken: process.env.DEVOPNESS_API_TOKEN
});

async function getUserProfile() {
  try {
    // Retrieve current user details
    const currentUser = await devopnessApi.users.getUserMe();
    console.log('User ID:', currentUser.data.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
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
