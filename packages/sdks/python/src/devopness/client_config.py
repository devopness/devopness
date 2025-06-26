"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

import re
from importlib.metadata import version
from platform import python_version, system
from typing import TypedDict

from pydantic import field_validator

from .base import DevopnessBaseModel
from .core.sdk_error import DevopnessSdkError

__all__ = ["DevopnessClientConfig", "DevopnessClientConfigDict", "get_user_agent"]


def get_user_agent(
    product_name: str = "devopness-sdk-python",
    product_package_name: str = "devopness",
) -> str:
    product_version = version(product_package_name)
    product_home_url = "https://github.com/devopness/devopness"

    platform = "python"
    platform_version = python_version()
    platform_system = system()

    # Example: devopness-sdk-python/1.0.0 +https://github.com/devopness/devopness (python/3.13.0 Linux)               # noqa: E501
    return f"{product_name}/{product_version} +{product_home_url} ({platform}/{platform_version} {platform_system})"  # noqa: E501


class DevopnessClientConfig(DevopnessBaseModel):
    """
    Configuration model for Devopness API client.

    Attributes:
        auto_refresh_token (bool): Controls whether the access token is
                                   automatically refreshed.
        base_url (str): Base URL for API requests.
        debug (bool): Controls whether debug information is printed to the console.
        default_encoding (str): Default encoding for response content.
        headers (dict[str, str]): Default headers for API requests.
        timeout (int): Request timeout in seconds.
    """

    auto_refresh_token: bool = True
    base_url: str = "https://api.devopness.com"
    debug: bool = False
    default_encoding: str = "utf-8"
    headers: dict[str, str] = {  # noqa: RUF012
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": get_user_agent(),
    }
    timeout: int = 30

    @field_validator("base_url", mode="before")
    @classmethod
    def validate_base_url(cls, value: str) -> str:
        if not re.match(r"^https?://", value):
            raise DevopnessSdkError(
                "\nDevopness SDK Error: Invalid 'base_url' in client configuration."
                "\nExpected a URL starting with 'http://' or 'https://', but received: "
                f"'{value}'."
                "\n\nHint: Make sure the 'base_url' includes the correct protocol,"
                " e.g., 'https://api.devopness.com'."
            )

        return value


class DevopnessClientConfigDict(TypedDict, total=False):
    """
    TypedDict for DevopnessClientConfig.
    """

    auto_refresh_token: bool
    base_url: str
    debug: bool
    default_encoding: str
    headers: dict[str, str]
    timeout: int
    user_agent: str
