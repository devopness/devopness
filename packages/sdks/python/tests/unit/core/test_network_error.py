import unittest

import httpx

from devopness._core.network_error import (
    handle_network_errors,
    handle_network_errors_sync,
)
from devopness.core import DevopnessNetworkError


@handle_network_errors
async def failing_request() -> httpx.Response:
    # This will raise a real network error (DNS resolution failure)
    async with httpx.AsyncClient() as client:
        return await client.get("https://host.invalid/")


@handle_network_errors_sync
def failing_request_sync() -> httpx.Response:
    # This will raise a real network error (DNS resolution failure)
    with httpx.Client() as client:
        return client.get("https://host.invalid/")


class TestDevopnessNetworkError(unittest.IsolatedAsyncioTestCase):
    async def test_devopness_network_error(self) -> None:
        with self.assertRaises(DevopnessNetworkError) as context:
            await failing_request()

        error = context.exception

        assert error.url == "https://host.invalid/"
        assert error.method == "GET"

        assert isinstance(error.exception, httpx.RequestError)

        string_output = str(error)
        assert (
            "\nDevopness SDK Error: Network Request Failed\n\n"
            "Request: GET https://host.invalid/\n"
            "Exception: [Errno -2]"
        ) in string_output

    def test_devopness_network_error_sync(self) -> None:
        with self.assertRaises(DevopnessNetworkError) as context:
            failing_request_sync()

        error = context.exception

        assert error.url == "https://host.invalid/"
        assert error.method == "GET"

        assert isinstance(error.exception, httpx.RequestError)

        string_output = str(error)
        assert (
            "\nDevopness SDK Error: Network Request Failed\n\n"
            "Request: GET https://host.invalid/\n"
            "Exception: [Errno -2]"
        ) in string_output
