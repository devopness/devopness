# Devopness SDK - Python ><>

The official Devopness SDK for Python.

The Devopness SDK for Python provides a set of predefined classes that offer easy and consistent access to Devopness platform resources. Whether you're building CLI tools, backend services, or automation scripts, this SDK helps you interact with the Devopness API.

## 📌 Table of Contents

- [Status](#status)
- [Usage](#usage)
  - [Install](#install)
  - [Initializing](#initializing)
  - [Custom Configuration](#custom-configuration)
  - [Authenticating](#authenticating)
    - [Asynchronous usage](#asynchronous-usage)
    - [Synchronous usage](#synchronous-usage)
  - [Invoking authentication-protected endpoints](#invoking-authentication-protected-endpoints)
    - [Asynchronous usage](#asynchronous-usage-1)
    - [Synchronous usage](#synchronous-usage-1)
- [Development](#development)
  - [With Docker](#with-docker)

## Status

This SDK is currently under active development and is not yet recommended for production use. Features, structure, and usage may change significantly until a stable version is released.

## Usage

The Devopness SDK for Python supports both asynchronous and synchronous usage. By default, all SDK methods are asynchronous and must be awaited. However, each service method also provides a synchronous alternative with the suffix **\_sync**.

This allows you to use the SDK in a wide range of scenarios, whether you are building asynchronous applications or need synchronous behavior.

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

To start using the Devopness SDK, just import it and create a new instance of the `DevopnessClient` class.

Here is a simple generic example that can be used in `Python` applications:

```python
from devopness import DevopnessClient

devopness = DevopnessClient()
```

### Custom Configuration

You can customize the SDK behavior by providing a `DevopnessClientConfig` object when instantiating the client:

```python
from devopness import DevopnessClient, DevopnessClientConfig

config = DevopnessClientConfig(
    base_url='https://api.devopness.com',
    timeout=10
)

devopness = DevopnessClient(config)
```

The `DevopnessClientConfig` supports the following options:

| Parameter          | Default                     | Description                              |
| ------------------ | --------------------------- | ---------------------------------------- |
| `base_url`         | `https://api.devopness.com` | Base URL for all API requests            |
| `timeout`          | `30`                        | Timeout for HTTP requests (in seconds)   |
| `default_encoding` | `utf-8`                     | Encoding used to decode response content |

This configuration allows you to adapt the SDK to your specific use case, such as changing the API endpoint or tweaking performance-related settings.

### Authenticating

To authenticate, invoke the `login_user` method on the `users` service:

#### Asynchronous usage

```python
import asyncio

from devopness import DevopnessClient
from devopness.models import UserLogin

devopness = DevopnessClient()

async def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    user_tokens = await devopness.users.login_user(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed.
    devopness.access_token = user_tokens.data.access_token

# Invoke the authentication method
if __name__ == "__main__":
    asyncio.run(authenticate('user@email.com', 'secret-password'))
```

#### Synchronous usage

```python
from devopness import DevopnessClient
from devopness.models import UserLogin

devopness = DevopnessClient()

def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    user_tokens = devopness.users.login_user_sync(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed.
    devopness.access_token = user_tokens.data.access_token

# Invoke the authentication method
if __name__ == "__main__":
    authenticate('user@email.com', 'secret-password')
```

In the examples above, `user_tokens` is an instance of `ApiResponse`, and the `data` property contains the data returned from the API. See [api_response.py](https://github.com/devopness/devopness/blob/main/packages/sdks/python/devopness/common/api_response.py) for reference.

### Invoking authentication-protected endpoints

Once an authentication token is set, any protected endpoint can be invoked.
Example: retrieving current user details.

#### Asynchronous usage

```python
import asyncio

from devopness import DevopnessClient
from devopness.models import UserLogin

devopness = DevopnessClient()

async def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    user_tokens = await devopness.users.login_user(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed.
    devopness.access_token = user_tokens.data.access_token

async def get_user_profile():
    # Ensure an auth token is retrieved and set to the SDK instance
    await authenticate('user@email.com', 'secret-password')

    # Now that we're authenticated, we can invoke methods on any service.
    # Here we're invoking the `get_user_me()` method on the `users` service
    current_user = await devopness.users.get_user_me()
    print(f'Successfully retrieved user profile with ID: {current_user.data.id}')

# Invoke the get user profile method
if __name__ == "__main__":
    asyncio.run(get_user_profile())
```

#### Synchronous usage

```python
from devopness import DevopnessClient
from devopness.models import UserLogin

devopness = DevopnessClient()

def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    user_tokens = devopness.users.login_user_sync(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed.
    devopness.access_token = user_tokens.data.access_token

def get_user_profile():
    # Ensure an auth token is retrieved and set to the SDK instance
    authenticate('user@email.com', 'secret-password')

    # Now that we're authenticated, we can invoke methods on any service.
    # Here we're invoking the `get_user_sync()` method on the `users` service
    current_user = devopness.users.get_user_sync(1)
    print(f'Successfully retrieved user profile with ID: {current_user.data.id}')

# Invoke the get user profile method
if __name__ == "__main__":
    get_user_profile()
```

In the examples above, `current_user` is an instance of `ApiResponse`, and the `data` property contains the data returned from the API.

## Development

To build the Devopness Python SDK locally, follow these steps:

### With Docker

#### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Make](https://www.gnu.org/software/make/)

#### Steps

1. Navigate to the project directory:

```shell
cd packages/sdks/python/
```

2. Build the Docker image:

```shell
make build-image
```

3. Build the Python SDK:

```shell
make build-sdk-python
```
