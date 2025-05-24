"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import ClassVar, TypedDict

from .base import DevopnessBaseModel

__all__ = ["DevopnessClientConfig", "DevopnessClientConfigDict"]


class DevopnessClientConfig(DevopnessBaseModel):
    """
    Configuration model for Devopness API client.

    Attributes:
        auto_refresh_token (bool): Controls whether the access token is
                                   automatically refreshed.
        base_url (str): Base URL for API requests.
        debug (bool): Controls whether debug information is printed to the console.
        default_encoding (str): Default encoding for response content.
        headers (ClassVar[dict[str, str]]): Default headers for API requests.
        timeout (int): Request timeout in seconds.
    """

    auto_refresh_token: bool = True
    base_url: str = "https://api.devopness.com"
    debug: bool = False
    default_encoding: str = "utf-8"
    headers: ClassVar[dict[str, str]] = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    timeout: int = 30


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
