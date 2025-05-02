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
        base_url (str): Base URL for API requests.
        timeout (int): Request timeout in seconds.
        default_encoding (str): Default encoding for response content.
        headers (ClassVar[dict[str, str]]): Default headers for API requests.
        debug (bool): Controls whether debug information is printed to the console.
    """

    base_url: str = "https://api.devopness.com"
    timeout: int = 30
    default_encoding: str = "utf-8"
    headers: ClassVar[dict[str, str]] = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    debug: bool = False


class DevopnessClientConfigDict(TypedDict, total=False):
    """
    TypedDict for DevopnessClientConfig.
    """

    base_url: str
    timeout: int
    default_encoding: str
    headers: dict[str, str]
    debug: bool
