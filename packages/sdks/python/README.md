# Devopness SDK - Python

[![PyPI version](https://img.shields.io/pypi/v/devopness.svg)](https://pypi.org/project/devopness/)

The official Devopness SDK for Python.

This SDK provides predefined classes to access Devopness platform resources. It's suitable for building CLI tools, backend services, or automation scripts, helping you interact with the Devopness API.

## 📌 Table of Contents

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

## Usage

The SDK supports both asynchronous and synchronous usage, so you can choose based on your needs.

### Install

Install the SDK using your preferred package manager:

```bash
# Using uv
uv add devopness

# Using poetry
poetry add devopness

# Using pip
pip install devopness
```

### Initializing

Import the SDK and create an instance of `DevopnessClient` or `DevopnessClientAsync`:

```python
from devopness import DevopnessClient, DevopnessClientAsync

devopness = DevopnessClient()
devopness_async = DevopnessClientAsync()
```

### Custom Configuration

You can provide a custom configuration when initializing the client:

```python
from devopness import DevopnessClient, DevopnessClientAsync, DevopnessClientConfig

config = DevopnessClientConfig(base_url='https://api.devopness.com', timeout=10)

devopness = DevopnessClient(config)
devopness_async = DevopnessClientAsync(config)
```

Configuration options:

| Parameter            | Default                     | Description                                         |
| -------------------- | --------------------------- | --------------------------------------------------- |
| `auto_refresh_token` | `True`                      | Whether the access token is automatically refreshed |
| `base_url`           | `https://api.devopness.com` | Base URL for all API requests                       |
| `timeout`            | `30`                        | Timeout for HTTP requests (in seconds)              |
| `default_encoding`   | `utf-8`                     | Encoding for response content                       |

### Authenticating

To authenticate, invoke the `login_user` method on the `users` service.

#### Asynchronous usage

```python
import asyncio

from devopness import DevopnessClientAsync
from devopness.models import UserLogin

devopness = DevopnessClientAsync({'auto_refresh_token': False})

async def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    user_tokens = await devopness.users.login_user(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed,
    # if the `auto_refresh_token` option is set to `False`.
    devopness.access_token = user_tokens.data.access_token

if __name__ == "__main__":
    asyncio.run(authenticate('user@email.com', 'secret-password'))
```

#### Synchronous usage

```python
from devopness import DevopnessClient
from devopness.models import UserLogin

devopness = DevopnessClient({'auto_refresh_token': False})

def authenticate(user_email, user_pass):
    user_data = UserLogin(email=user_email, password=user_pass)
    user_tokens = devopness.users.login_user(user_data)

    # The `access_token` must be set every time a token is obtained or refreshed,
    # if the `auto_refresh_token` option is set to `False`.
    devopness.access_token = user_tokens.data.access_token

if __name__ == "__main__":
    authenticate('user@email.com', 'secret-password')
```

### Invoking authentication-protected endpoints

Once authenticated, you can invoke protected endpoints like retrieving user details.

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
    await authenticate('user@email.com', 'secret-password')
    current_user = await devopness.users.get_user_me()
    print(f'User ID: {current_user.data.id}')

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
    authenticate('user@email.com', 'secret-password')
    current_user = devopness.users.get_user_me()
    print(f'User ID: {current_user.data.id}')

if __name__ == "__main__":
    get_user_profile()
```

### Error Handling

The SDK provides structured error handling through exceptions:

- `DevopnessApiError`: This exception is raised when the Devopness API returns an error response. This typically indicates issues with the request itself, such as invalid input data, unauthorized access, or resource not found. It provides the following attributes to help diagnose the error:

| Attribute   | Description                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| status_code | The HTTP status code returned by the API                                                                           |
| message     | A general error message from the API                                                                               |
| errors      | An optional dictionary containing detailed validation errors, often encountered during create or update operations |

- `DevopnessNetworkError`: This exception is raised when a generic network-related issue occurs during the communication with the Devopness API. This could be due to problems like an unreachable host, connection timeouts, or other network configuration errors.

Both exceptions inherit from `DevopnessSdkError`, the base class for all SDK exceptions. You can use this class to catch and handle all exceptions raised by the SDK.

## Development

To build the SDK locally, use Docker:

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
