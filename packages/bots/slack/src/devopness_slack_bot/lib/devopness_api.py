"""
Initializes an asynchronous Devopness Client and ensures authentication.
"""

from base64 import b64decode
from dataclasses import dataclass
from typing import Literal

from devopness import DevopnessClientAsync, DevopnessClientConfig
from devopness.base import DevopnessBaseService, DevopnessBaseServiceAsync
from devopness.client_config import get_user_agent

from devopness_slack_bot.lib.environment import EnvironmentVariables


def get_devopness_client(env: EnvironmentVariables) -> DevopnessClientAsync:
    config = DevopnessClientConfig(
        auto_refresh_token=False,
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": get_user_agent(
                product_name="devopness-slack-bot",
                product_package_name="devopness-slack-bot",
            ),
        },
    )

    config.base_url = env.DEVOPNESS_API_URL or config.base_url

    return DevopnessClientAsync(config)


@dataclass
class DevopnessCredentials:
    type: Literal[
        "api_token",
        "oauth_token",
    ]

    data: str


def ensure_authenticated(
    credentials: DevopnessCredentials,
) -> None:
    match credentials.type:
        case "api_token":
            decoded_token = b64decode(credentials.data).decode("utf-8")

            DevopnessBaseService._access_token = decoded_token
            DevopnessBaseServiceAsync._access_token = decoded_token

        case "oauth_token":
            decoded_token = b64decode(credentials.data).decode("utf-8")

            DevopnessBaseService._access_token = decoded_token
            DevopnessBaseServiceAsync._access_token = decoded_token

        case _:
            raise ValueError(f"Unsupported credentials type: {credentials.type}")
