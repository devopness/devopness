import time
import unittest
from collections.abc import AsyncGenerator, Iterator
from datetime import UTC, datetime, timedelta
from typing import Required, TypedDict
from unittest.mock import Mock, patch

import httpx
from httpx._client import BoundAsyncStream, BoundSyncStream
from httpx._types import AsyncByteStream, SyncByteStream
from pydantic import Field, StrictInt, StrictStr

from devopness import DevopnessClientConfig
from devopness.base import (
    DevopnessBaseModel,
    DevopnessBaseService,
    DevopnessBaseServiceAsync,
    DevopnessClientState,
)
from devopness.base.base_service import parse_payload
from devopness.core import DevopnessSdkError


class DummyModel(DevopnessBaseModel):
    id: StrictInt | None = Field(
        default=None,
        description="The unique ID of the given Dummy.",
    )
    name: StrictStr = Field(description="The name of the dummy.")
    description: StrictStr | None = Field(
        default=None,
        description="The description of the dummy.",
    )


class DummyModelPlain(TypedDict, total=False):
    id: int | None
    name: Required[str]
    description: str | None


class DummySyncStream(SyncByteStream):
    def __iter__(self) -> Iterator[bytes]:
        yield b'{"access_token": "abc", "refresh_token": "def", "expires_in": 3600}'

    def close(self) -> None:
        pass


class DummyAsyncStream(AsyncByteStream):
    async def __aiter__(self) -> AsyncGenerator[bytes, None]:
        yield b'{"access_token": "abc", "refresh_token": "def", "expires_in": 3600}'

    async def aclose(self) -> None:
        pass


class TestDevopnessBaseService(unittest.TestCase):
    dummy_request = httpx.Request("", "")
    dummy_response = httpx.Response(200, request=dummy_request)

    def setUp(self) -> None:
        self.state = DevopnessClientState(
            config=DevopnessClientConfig(
                base_url="https://test.local",
                auto_refresh_token=False,
            )
        )
        self.service = DevopnessBaseService(self.state)

    @patch("httpx.Client._send_single_request")
    def test_unauthenticated_request_omits_auth_header(
        self,
        mock: Mock,
    ) -> None:
        self.state.access_token = None

        mock.return_value = self.dummy_response
        self.service._get("/resource")

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "GET")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertNotIn("Authorization", request.headers)

    @patch("httpx.Client._send_single_request")
    def test_authenticated_request_includes_auth_header(
        self,
        mock: Mock,
    ) -> None:
        self.state.access_token = "dp-token123"  # ruff:ignore[hardcoded-password-string]

        mock.return_value = self.dummy_response
        self.service._delete("/resource/123")

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "DELETE")
        self.assertEqual(request.url, "https://test.local/resource/123")

        self.assertIn("Authorization", request.headers)
        self.assertEqual(request.headers["Authorization"], "Bearer dp-token123")

    @patch("httpx.Client._send_single_request")
    def test_use_api_token_to_authenticate_request_includes_auth_header(
        self,
        mock: Mock,
    ) -> None:
        self.state.config.api_token = "devopness_api_token"  # ruff:ignore[hardcoded-password-string]

        mock.return_value = self.dummy_response
        self.service._get("/resource/123")

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "GET")
        self.assertEqual(request.url, "https://test.local/resource/123")

        self.assertIn("Authorization", request.headers)
        self.assertEqual(request.headers["Authorization"], "Bearer devopness_api_token")

    @patch("httpx.Client.send")
    def test_post_dict_removes_null_keys(
        self,
        mock: Mock,
    ) -> None:
        payload: DummyModelPlain = {"name": "John Doe"}
        self.service._post("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "POST")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"name":"John Doe"}')

    @patch("httpx.Client.send")
    def test_post_sdk_model_removes_null_fields(
        self,
        mock: Mock,
    ) -> None:
        payload = DummyModel(name="John Doe")
        self.service._post("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "POST")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"name":"John Doe"}')

    @patch("httpx.Client.send")
    def test_post_without_payload(
        self,
        mock: Mock,
    ) -> None:
        self.service._post("/resource")

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "POST")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b"")

    @patch("httpx.Client.send")
    def test_put_dict_removes_null_keys(
        self,
        mock: Mock,
    ) -> None:
        payload: DummyModelPlain = {"id": 123, "name": "John Doe"}
        self.service._put("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"id":123,"name":"John Doe"}')

    @patch("httpx.Client.send")
    def test_put_sdk_model_removes_null_fields(
        self,
        mock: Mock,
    ) -> None:
        payload = DummyModel(id=123, name="John Doe")
        self.service._put("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"id":123,"name":"John Doe"}')

    @patch("httpx.Client.send")
    def test_put_without_payload(
        self,
        mock: Mock,
    ) -> None:
        self.service._put("/resource")

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b"")

    def test_update_access_and_refresh_tokens(
        self,
    ) -> None:
        response = httpx.Response(
            status_code=200,
            headers={"Content-Type": "application/json"},
            stream=BoundSyncStream(
                DummySyncStream(),
                response=None,  # type: ignore
                start=time.perf_counter(),
            ),
        )

        response.stream._response = response  # type: ignore

        now = datetime.now(UTC)
        self.service._save_access_token(response)

        self.assertEqual(self.state.access_token, "abc")
        self.assertEqual(self.state.refresh_token, "def")
        self.assertIsNotNone(self.state.token_expires_at)

        expected = now + timedelta(seconds=3600)
        actual = self.state.token_expires_at

        delta_seconds = abs((expected - actual).total_seconds())  # type: ignore
        self.assertLess(
            delta_seconds,
            1,
            f"Invalid token expiration date. Expected: {expected.isoformat()}. Actual: {actual.isoformat()}.",  # type: ignore
        )

    @patch("httpx.Client.send")
    def test_request_includes_expected_user_agent_header(
        self,
        mock: Mock,
    ) -> None:
        self.service._put("/resource")

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        user_agent = request.headers.get("User-Agent")
        self.assertIsNotNone(user_agent)

        # Expected User-Agent format:
        # devopness-sdk-python/<version> +https://github.com/devopness/devopness (python/<python_version> <os>)
        pattern = (
            r"devopness-sdk-python/\d+\.\d+\.\d+ \+https://github\.com/devopness/devopness "
            r"\(python/\d+\.\d+\.\d+ [A-Za-z0-9_\-]+\)"
        )
        self.assertRegex(user_agent, pattern)


class TestDevopnessBaseServiceAsync(unittest.IsolatedAsyncioTestCase):
    dummy_request = httpx.Request("", "")
    dummy_response = httpx.Response(200, request=dummy_request)

    async def asyncSetUp(self) -> None:
        self.state = DevopnessClientState(
            config=DevopnessClientConfig(
                base_url="https://test.local",
                auto_refresh_token=False,
            )
        )
        self.service = DevopnessBaseServiceAsync(self.state)

    @patch("httpx.AsyncClient._send_single_request")
    async def test_unauthenticated_request_omits_auth_header(
        self,
        mock: Mock,
    ) -> None:
        self.state.access_token = None

        mock.return_value = self.dummy_response
        await self.service._get("/resource")

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "GET")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertNotIn("Authorization", request.headers)

    @patch("httpx.AsyncClient._send_single_request")
    async def test_authenticated_request_includes_auth_header(
        self,
        mock: Mock,
    ) -> None:
        self.state.access_token = "dp-token123"  # ruff:ignore[hardcoded-password-string]

        mock.return_value = self.dummy_response
        await self.service._delete("/resource/123")

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "DELETE")
        self.assertEqual(request.url, "https://test.local/resource/123")

        self.assertIn("Authorization", request.headers)
        self.assertEqual(request.headers["Authorization"], "Bearer dp-token123")

    @patch("httpx.AsyncClient._send_single_request")
    async def test_use_api_token_to_authenticate_request_includes_auth_header(
        self,
        mock: Mock,
    ) -> None:
        self.state.config.api_token = "devopness_api_token"  # ruff:ignore[hardcoded-password-string]

        mock.return_value = self.dummy_response
        await self.service._delete("/resource/123")

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "DELETE")
        self.assertEqual(request.url, "https://test.local/resource/123")

        self.assertIn("Authorization", request.headers)
        self.assertEqual(request.headers["Authorization"], "Bearer devopness_api_token")

    @patch("httpx.AsyncClient.send")
    async def test_post_dict_removes_null_keys(
        self,
        mock: Mock,
    ) -> None:
        payload: DummyModelPlain = {"name": "Cool Project"}
        await self.service._post("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "POST")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"name":"Cool Project"}')

    @patch("httpx.AsyncClient.send")
    async def test_post_sdk_model_removes_null_fields(
        self,
        mock: Mock,
    ) -> None:
        payload = DummyModel(name="Cool Project")
        await self.service._post("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "POST")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"name":"Cool Project"}')

    @patch("httpx.AsyncClient.send")
    async def test_post_without_payload(
        self,
        mock: Mock,
    ) -> None:
        await self.service._post("/resource")

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "POST")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b"")

    @patch("httpx.AsyncClient.send")
    async def test_put_dict_removes_null_keys(
        self,
        mock: Mock,
    ) -> None:
        payload: DummyModelPlain = {"id": 123, "name": "Cool Project"}
        await self.service._put("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"id":123,"name":"Cool Project"}')

    @patch("httpx.AsyncClient.send")
    async def test_put_sdk_model_removes_null_fields(
        self,
        mock: Mock,
    ) -> None:
        payload = DummyModel(id=123, name="Cool Project")
        await self.service._put("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"id":123,"name":"Cool Project"}')

    @patch("httpx.AsyncClient.send")
    async def test_put_without_payload(
        self,
        mock: Mock,
    ) -> None:
        await self.service._put("/resource")

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b"")

    async def test_update_access_and_refresh_tokens(
        self,
    ) -> None:
        response = httpx.Response(
            status_code=200,
            headers={"Content-Type": "application/json"},
            stream=BoundAsyncStream(
                DummyAsyncStream(),
                response=None,  # type: ignore
                start=time.perf_counter(),
            ),
        )

        response.stream._response = response  # type: ignore

        now = datetime.now(UTC)
        await self.service._save_access_token(response)

        self.assertEqual(self.state.access_token, "abc")
        self.assertEqual(self.state.refresh_token, "def")
        self.assertIsNotNone(self.state.token_expires_at)

        expected = now + timedelta(seconds=3600)
        actual = self.state.token_expires_at

        delta_seconds = abs((expected - actual).total_seconds())  # type: ignore
        self.assertLess(
            delta_seconds,
            1,
            f"Invalid token expiration date. Expected: {expected.isoformat()}. Actual: {actual.isoformat()}.",  # type: ignore
        )

    @patch("httpx.AsyncClient.send")
    async def test_request_includes_expected_user_agent_header(
        self,
        mock: Mock,
    ) -> None:
        await self.service._put("/resource")

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        user_agent = request.headers.get("User-Agent")
        self.assertIsNotNone(user_agent)

        # Expected User-Agent format:
        # devopness-sdk-python/<version> +https://github.com/devopness/devopness (python/<python_version> <os>)
        pattern = (
            r"devopness-sdk-python/\d+\.\d+\.\d+ \+https://github\.com/devopness/devopness "
            r"\(python/\d+\.\d+\.\d+ [A-Za-z0-9_\-]+\)"
        )
        self.assertRegex(user_agent, pattern)


class TestDevopnessBaseServiceNotInitialized(unittest.TestCase):
    def setUp(self) -> None:
        self.sync_config = getattr(DevopnessBaseService, "_config", None)
        self.async_config = getattr(DevopnessBaseServiceAsync, "_config", None)

        for service_cls in (DevopnessBaseService, DevopnessBaseServiceAsync):
            if hasattr(service_cls, "_config"):
                del service_cls._config

    def tearDown(self) -> None:
        if self.sync_config is not None:
            DevopnessBaseService._config = self.sync_config

        if self.async_config is not None:
            DevopnessBaseServiceAsync._config = self.async_config

    def test_service_without_config_raises_sdk_error(self) -> None:
        with self.assertRaises(DevopnessSdkError) as ctx:
            DevopnessBaseService()

        self.assertIn("DevopnessBaseService is not initialized", str(ctx.exception))

    def test_async_service_without_config_raises_sdk_error(self) -> None:
        with self.assertRaises(DevopnessSdkError) as ctx:
            DevopnessBaseServiceAsync()

        self.assertIn(
            "DevopnessBaseServiceAsync is not initialized",
            str(ctx.exception),
        )


class TestParsePayload(unittest.TestCase):
    def test_parse_payload_returns_none_for_empty_payload(self) -> None:
        self.assertIsNone(parse_payload(None))

    def test_parse_payload_keeps_dict_payload_unchanged(self) -> None:
        payload = {"name": "dummy"}

        self.assertEqual(parse_payload(payload), payload)

    def test_parse_payload_omits_model_fields_that_were_not_set(self) -> None:
        payload = DummyModel(name="dummy")

        self.assertEqual(parse_payload(payload), {"name": "dummy"})

    def test_parse_payload_raises_sdk_error_for_unsupported_payload(self) -> None:
        for payload in ([1, 2, 3], "dummy", 42):
            with self.assertRaises(DevopnessSdkError):
                parse_payload(payload)  # type: ignore[arg-type]

    def test_parse_payload_error_names_the_received_type(self) -> None:
        with self.assertRaises(DevopnessSdkError) as ctx:
            parse_payload([1, 2, 3])  # type: ignore[arg-type]

        self.assertIn("'list'", str(ctx.exception))
