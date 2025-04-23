import httpx
import pytest

from devopness._core.network_error import (
    handle_network_errors,
    handle_network_errors_sync,
)
from devopness.core import DevopnessNetworkError


@handle_network_errors
async def failing_request():
    # This will raise a real network error (DNS resolution failure)
    async with httpx.AsyncClient() as client:
        return await client.get("https://host.invalid/")


@handle_network_errors_sync
def failing_request_sync():
    # This will raise a real network error (DNS resolution failure)
    with httpx.Client() as client:
        return client.get("https://host.invalid/")


@pytest.mark.asyncio
async def test_devopness_network_error() -> None:
    with pytest.raises(DevopnessNetworkError) as exc_info:
        await failing_request()

    error = exc_info.value

    assert error.url == "https://host.invalid/"
    assert error.method == "GET"

    assert isinstance(error.exception, httpx.RequestError)

    string_output = str(error)
    assert (
        "\nDevopness SDK Error: Network Request Failed\n\n"
        "Request: GET https://host.invalid/\n"
        "Exception: [Errno -2]"
    ) in string_output


def test_devopness_network_error_sync() -> None:
    with pytest.raises(DevopnessNetworkError) as exc_info:
        failing_request_sync()

    error = exc_info.value

    assert error.url == "https://host.invalid/"
    assert error.method == "GET"

    assert isinstance(error.exception, httpx.RequestError)

    string_output = str(error)
    assert (
        "\nDevopness SDK Error: Network Request Failed\n\n"
        "Request: GET https://host.invalid/\n"
        "Exception: [Errno -2]"
    ) in string_output
