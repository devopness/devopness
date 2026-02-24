# Devopness SDK - Python

[![PyPI version](https://img.shields.io/pypi/v/devopness.svg)](https://pypi.org/project/devopness/)

The official Devopness SDK for Python.

This SDK provides predefined classes to access Devopness platform resources. It's suitable for building CLI tools, backend services, or automation scripts, helping you interact with the Devopness API.

## 📌 Table of Contents

- [Devopness SDK - Python](#devopness-sdk---python)
  - [📌 Table of Contents](#-table-of-contents)
  - [Usage](#usage)
    - [Install](#install)
    - [Initializing](#initializing)
    - [Custom Configuration](#custom-configuration)
    - [Authentication](#authentication)
      - [Authentication with Personal Access Token](#authentication-with-personal-access-token)
        - [Asynchronous usage](#asynchronous-usage)
        - [Synchronous usage](#synchronous-usage)
      - [Authentication with Project API Token](#authentication-with-project-api-token)
        - [Asynchronous usage](#asynchronous-usage-1)
        - [Synchronous usage](#synchronous-usage-1)
      - [Authentication with Login (Deprecated)](#authentication-with-login-deprecated)
    - [Invoking authentication-protected endpoints](#invoking-authentication-protected-endpoints)
      - [Asynchronous usage](#asynchronous-usage-2)
      - [Synchronous usage](#synchronous-usage-2)
    - [Error Handling](#error-handling)
  - [Development](#development)
    - [With Docker](#with-docker)
      - [Prerequisites](#prerequisites)
      - [Steps](#steps)

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

### Authentication

#### Authentication with Personal Access Token

Ensure you have a Personal Access Token from Devopness. If you don't have one, see [Add a Personal Access Token](https://www.devopness.com/docs/api-tokens/personal-access-tokens/add-personal-access-token).

##### Asynchronous usage

```python
import asyncio
from devopness import DevopnessClientAsync, DevopnessClientConfig

# Option 1: Pass token during initialization
config = DevopnessClientConfig(api_token='your-personal-access-token-here')
devopness = DevopnessClientAsync(config)

# Option 2: Set token after initialization
devopness = DevopnessClientAsync()
devopness.api_token = 'your-personal-access-token-here'

async def main():
    current_user = await devopness.users.get_user_me()
    print(f'User ID: {current_user.data.id}')

if __name__ == "__main__":
    asyncio.run(main())
```

##### Synchronous usage

```python
from devopness import DevopnessClient, DevopnessClientConfig

# Option 1: Pass token during initialization
config = DevopnessClientConfig(api_token='your-personal-access-token-here')
devopness = DevopnessClient(config)

# Option 2: Set token after initialization
devopness = DevopnessClient()
devopness.api_token = 'your-personal-access-token-here'

def main():
    current_user = devopness.users.get_user_me()
    print(f'User ID: {current_user.data.id}')

if __name__ == "__main__":
    main()
```

#### Authentication with Project API Token

Ensure you have a Project API Token from Devopness. If you don't have one, see [Add a Project API Token](https://www.devopness.com/docs/api-tokens/project-api-tokens/add-project-api-token).

##### Asynchronous usage

```python
import asyncio
from devopness import DevopnessClientAsync

devopness = DevopnessClientAsync()
devopness.api_token = 'your-project-api-token-here'

async def main():
    project = await devopness.projects.get_project(project_id=123)
    print(f'Project name: {project.data.name}')

if __name__ == "__main__":
    asyncio.run(main())
```

##### Synchronous usage

```python
from devopness import DevopnessClient

devopness = DevopnessClient()
devopness.api_token = 'your-project-api-token-here'

def main():
    project = devopness.projects.get_project(project_id=123)
    print(f'Project name: {project.data.name}')

if __name__ == "__main__":
    main()
```

#### Authentication with Login (Deprecated)

> **Warning:** Email/password authentication is no longer supported. API requests using this method return 4xx errors.

### Invoking authentication-protected endpoints

Once authenticated, you can invoke protected endpoints. Here's an example of retrieving user details and listing projects:

#### Asynchronous usage

```python
import asyncio
import os
from devopness import DevopnessClientAsync, DevopnessClientConfig
from devopness.core import DevopnessSdkError

config = DevopnessClientConfig(api_token=os.getenv('DEVOPNESS_API_TOKEN'))
devopness = DevopnessClientAsync(config)

async def get_user_profile():
    try:
        # Retrieve current user details
        current_user = await devopness.users.get_user_me()
        print(f'User ID: {current_user.data.id}')

    except DevopnessSdkError as error:
        print(f'Error: {error}')

if __name__ == "__main__":
    asyncio.run(get_user_profile())
```

#### Synchronous usage

```python
import os
from devopness import DevopnessClient, DevopnessClientConfig
from devopness.core import DevopnessSdkError

config = DevopnessClientConfig(api_token=os.getenv('DEVOPNESS_API_TOKEN'))
devopness = DevopnessClient(config)

def get_user_profile():
    try:
        # Retrieve current user details
        current_user = devopness.users.get_user_me()
        print(f'User ID: {current_user.data.id}')

    except DevopnessSdkError as error:
        print(f'Error: {error}')

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
