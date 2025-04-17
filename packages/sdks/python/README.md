# Devopness SDK - Python

The official Devopness SDK for Python.

Devopness SDK for Python provides a set of pre-defined classes that offer easy and consistent access to Devopness platform resources. Whether you're building CLI tools, backend services, or automation scripts, this SDK helps you interact with the Devopness API.

## Status

This SDK is currently under active development and not yet recommended for production use. Features, structure, and usage may change significantly until a stable version is released.

## Usage

### Install

Use your favorite package manager to install the Devopness SDK as a dependency of your project:

```bash
# Using uv
uv add devopness

# Using poetry
poetry add devopness

# Using pip
pip install devopness
```

### Initializing

To initialize the usage of Devopness SDK, just import it and create a new instance of `DevopnessApiClient` class.

Here is a generic simple example that can be used from `Python` applications:

```python
from devopness import DevopnessApiClient

devopness_api = DevopnessApiClient()
```

### Authenticating

To authenticate, just invoke the `login_user` method on the `users` service:

```python
from devopness import DevopnessApiClient
from devopness.models import UserLogin

devopness_api = DevopnessApiClient()

async def authenticate(user_email, user_pass):
    user_data = UserLogin(email=email, password=user_pass)
    user_tokens = await devopness_api.users.login_user(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed.
    devopness_api.access_token = user_tokens.data.access_token

# Invoke the authentication method
authenticate('user@email.com', 'secret-password')
```

In the example above, `user_tokens` is an instance of `ApiResponse` and the `data` property has the data requested from the API. See [api_response.py](https://github.com/devopness/devopness/blob/main/packages/sdks/python/devopness/common/api_response.py) for reference.

### Invoking authentication protected endpoints

Once an authentication token is set, any protected endpoint can be invoked.
Example retrieving current user details:

```python
from devopness import DevopnessApiClient
from devopness.models import UserLogin

devopness_api = DevopnessApiClient()

async def authenticate(user_email, user_pass):
    user_data = UserLogin(email=email, password=user_pass)
    user_tokens = await devopness_api.users.login_user(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed.
    devopness_api.access_token = user_tokens.data.access_token

async def get_user_profile():
    # Invoke the authentication method to ensure an auth token
    # is retrieved and set to the SDK instance
    await authenticate('user@email.com', 'secret-password')

    # Now that we're authenticated, we can invoke methods on any services.
    # Here we're invoking the `get_user_me()` method on the `users` service
    current_user = await devopness_api.users.get_user_me()
    print(f'Successfully retrieved user profile with ID: {current_user.data.id}')

get_user_profile()
```

In the example above, `current_user` is an instance of `ApiResponse` and the `data` property has the data requested from the API.

## Development

To build the SDK Python locally, follow these steps:

### With Docker

#### Pre-requisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [make](https://www.gnu.org/software/make/)

#### Steps

1. Navigate to the project directory

```shell
cd packages/sdks/python/
```

2. Build Docker Image

```shell
make build-image
```

3.Build the SDK Python

```shell
make build-sdk-python
```
