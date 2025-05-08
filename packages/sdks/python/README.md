# Devopness SDK - Python

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
  - [Error Handling](#error-handling)
- [Development](#development)
  - [With Docker](#with-docker)

## Status

This SDK is currently under active development and is not yet recommended for production use. Features, structure, and usage may change significantly until a stable version is released.

## Usage

The Devopness SDK for Python supports both asynchronous and synchronous usage. You can choose whether you want to use the SDK in an asynchronous or synchronous manner by instantiating the appropriate client class.

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

To start using the Devopness SDK, just import it and create a new instance of the `DevopnessClient` class or `DevopnessClientAsync` class.

Here is a simple generic example that can be used in `Python` applications:

```python
from devopness import DevopnessClient, DevopnessClientAsync

devopness = DevopnessClient()
devopness_async = DevopnessClientAsync()
```

### Custom Configuration

You can customize the SDK behavior by providing a `DevopnessClientConfig` object when instantiating the client:

```python
from devopness import DevopnessClient, DevopnessClientAsync, DevopnessClientConfig

config = DevopnessClientConfig(
    base_url='https://api.devopness.com',
    timeout=10
)

devopness = DevopnessClient(config)
devopness_async = DevopnessClientAsync(config)
```

The `DevopnessClientConfig` supports the following options:

| Parameter            | Default                     | Description                                                  |
| -------------------- | --------------------------- | ------------------------------------------------------------ |
| `auto_refresh_token` | `True`                      | Controls whether the access token is automatically refreshed |
| `base_url`           | `https://api.devopness.com` | Base URL for all API requests                                |
| `timeout`            | `30`                        | Timeout for HTTP requests (in seconds)                       |
| `default_encoding`   | `utf-8`                     | Encoding used to decode response content                     |

This configuration allows you to adapt the SDK to your specific use case, such as changing the API endpoint or tweaking performance-related settings.

### Authenticating

To authenticate, invoke the `login_user` method on the `users` service:

#### Asynchronous usage

```python
import asyncio

from devopness import DevopnessClientAsync
from devopness.models import UserLogin

devopness = DevopnessClientAsync({
    'auto_refresh_token': False
})

async def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    user_tokens = await devopness.users.login_user(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed,
    # if the `auto_refresh_token` option is set to `False`.
    devopness.access_token = user_tokens.data.access_token

# Invoke the authentication method
if __name__ == "__main__":
    asyncio.run(authenticate('user@email.com', 'secret-password'))
```

#### Synchronous usage

```python
from devopness import DevopnessClient
from devopness.models import UserLogin

devopness = DevopnessClient({
    'auto_refresh_token': False
})

def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    user_tokens = devopness.users.login_user(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed,
    # if the `auto_refresh_token` option is set to `False`.
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

from devopness import DevopnessClientAsync
from devopness.models import UserLogin

devopness = DevopnessClientAsync()

async def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    await devopness.users.login_user(user_data)

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
    devopness.users.login_user(user_data)

def get_user_profile():
    # Ensure an auth token is retrieved and set to the SDK instance
    authenticate('user@email.com', 'secret-password')

    # Now that we're authenticated, we can invoke methods on any service.
    # Here we're invoking the `get_user()` method on the `users` service
    current_user = devopness.users.get_user(1)
    print(f'Successfully retrieved user profile with ID: {current_user.data.id}')

# Invoke the get user profile method
if __name__ == "__main__":
    get_user_profile()
```

In the examples above, `current_user` is an instance of `ApiResponse`, and the `data` property contains the data returned from the API.

### Error Handling

The Devopness SDK for Python provides a structured approach to error handling through a hierarchy of exceptions.

> TIP:
> All SDK-specific exceptions inherit from the base class `DevopnessSdkError`.
> You can use this class to catch and handle all exceptions raised by the SDK.

- `DevopnessApiError`: This exception is raised when the Devopness API returns an error response. This typically indicates issues with the request itself, such as invalid input data, unauthorized access, or resource not found. It provides the following attributes to help diagnose the error:

| Attribute   | Description                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| status_code | The HTTP status code returned by the API                                                                           |
| message     | A general error message from the API                                                                               |
| errors      | An optional dictionary containing detailed validation errors, often encountered during create or update operations |

- `DevopnessNetworkError`: This exception is raised when a generic network-related issue occurs during the communication with the Devopness API. This could be due to problems like an unreachable host, connection timeouts, or other network configuration errors.

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

1. Build the Docker image:

```shell
make build-image
```

1. Build the Python SDK:

```shell
make build-sdk-python
```
