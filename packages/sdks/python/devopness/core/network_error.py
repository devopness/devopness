"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

import functools
from collections.abc import Callable

import httpx

from .sdk_error import DevopnessSdkError

__all__ = [
    "DevopnessNetworkError",
    "handle_network_errors",
    "handle_network_errors_sync",
]


class DevopnessNetworkError(DevopnessSdkError):
    """
    Exception raised when a network-related error occurs when making requests
    to the Devopness API.

    Attributes:
        url (httpx.URL): The URL that triggered the error.
        method (str): The HTTP method used in the failed request.
        exception (httpx.RequestError): The original exception raised by httpx.
    """

    url: str
    method: str
    exception: httpx.RequestError

    def __init__(
        self,
        url: httpx.URL,
        method: str,
        exception: httpx.RequestError,
    ) -> None:
        self.url = str(url)
        self.method = method
        self.exception = exception

        super().__init__()

    def __str__(self) -> str:
        return (
            "\nDevopness SDK Error: Network Request Failed\n"
            f"\nRequest: {self.method} {self.url}"
            f"\nException: {self.exception}"
        )


def handle_network_errors(func: Callable):  # type: ignore[no-untyped-def, type-arg]  # noqa: ANN201
    """
    Async decorator to catch and re-raise network-related exceptions
    as `DevopnessNetworkError`.

    Args:
        func (Callable): The async function to decorate.

    Returns:
        Callable: Wrapped function with error handling.

    Raises:
        DevopnessNetworkError: If an httpx.RequestError occurs.
    """

    @functools.wraps(func)
    async def wrapper(*args, **kwargs):  # type: ignore[no-untyped-def]  # noqa: ANN002, ANN003, ANN202
        try:
            return await func(*args, **kwargs)

        except httpx.RequestError as e:
            r = e.request

            raise DevopnessNetworkError(r.url, r.method, e) from e

    return wrapper


def handle_network_errors_sync(func: Callable):  # type: ignore[no-untyped-def, type-arg]  # noqa: ANN201
    """
    Decorator to catch and re-raise network-related exceptions
    as `DevopnessNetworkError`.

    Args:
        func (Callable): The function to decorate.

    Returns:
        Callable: Wrapped function with error handling.

    Raises:
        DevopnessNetworkError: If an httpx.RequestError occurs.
    """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):  # type: ignore[no-untyped-def]  # noqa: ANN002, ANN003, ANN202
        try:
            return func(*args, **kwargs)

        except httpx.RequestError as e:
            r = e.request

            raise DevopnessNetworkError(r.url, r.method, e) from e

    return wrapper
