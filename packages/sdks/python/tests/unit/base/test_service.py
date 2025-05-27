import time
import unittest
from datetime import datetime, timedelta, timezone
from typing import AsyncGenerator, Generator, Optional, Required, TypedDict
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
)


class DummyModel(DevopnessBaseModel):
    id: Optional[StrictInt] = Field(
        default=None,
        description="The unique ID of the given Dummy.",
    )
    name: StrictStr = Field(description="The name of the dummy.")
    description: Optional[StrictStr] = Field(
        default=None,
        description="The description of the dummy.",
    )


class DummyModelPlain(TypedDict, total=False):
    id: Optional[int]
    name: Required[str]
    description: Optional[str]


class DummySyncStream(SyncByteStream):
    def __iter__(self) -> Generator[bytes, None, None]:
        yield b'{"access_token": "abc", "refresh_token": "def", "expires_in": 3600}'

    def close(self) -> None:
        pass


class DummyAsyncStream(AsyncByteStream):
    async def __aiter__(self) -> AsyncGenerator[bytes, None]:
        yield b'{"access_token": "abc", "refresh_token": "def", "expires_in": 3600}'

    async def aclose(self) -> None:
        pass


class TestDevopnessBaseService(unittest.TestCase):
    DevopnessBaseService._config = DevopnessClientConfig(
        base_url="https://test.local",
        auto_refresh_token=False,
    )
    service = DevopnessBaseService()

    dummy_request = httpx.Request("", "")
    dummy_response = httpx.Response(200, request=dummy_request)

    @patch("httpx.Client._send_single_request")
    def test_unauthenticated_request_omits_auth_header(
        self,
        mock: Mock,
    ) -> None:
        DevopnessBaseService._access_token = None

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
        DevopnessBaseService._access_token = "dp-token123"  # noqa: S105

        mock.return_value = self.dummy_response
        self.service._delete("/resource/123")

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "DELETE")
        self.assertEqual(request.url, "https://test.local/resource/123")

        self.assertIn("Authorization", request.headers)
        self.assertEqual(request.headers["Authorization"], "Bearer dp-token123")

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

        now = datetime.now(timezone.utc)
        self.service._save_access_token(response)

        self.assertEqual(DevopnessBaseService._access_token, "abc")
        self.assertEqual(DevopnessBaseService._refresh_token, "def")
        self.assertIsNotNone(DevopnessBaseService._token_expires_at)

        expected = now + timedelta(seconds=3600)
        actual = DevopnessBaseService._token_expires_at

        delta_seconds = abs((expected - actual).total_seconds())  # type: ignore
        self.assertLess(
            delta_seconds,
            1,
            f"Invalid token expiration date. Expected: {expected.isoformat()}. Actual: {actual.isoformat()}.",  # type: ignore
        )


class TestDevopnessBaseServiceAsync(unittest.IsolatedAsyncioTestCase):
    DevopnessBaseServiceAsync._config = DevopnessClientConfig(
        base_url="https://test.local",
        auto_refresh_token=False,
    )
    service = DevopnessBaseServiceAsync()

    dummy_request = httpx.Request("", "")
    dummy_response = httpx.Response(200, request=dummy_request)

    @patch("httpx.AsyncClient._send_single_request")
    async def test_unauthenticated_request_omits_auth_header(
        self,
        mock: Mock,
    ) -> None:
        DevopnessBaseServiceAsync._access_token = None

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
        DevopnessBaseServiceAsync._access_token = "dp-token123"  # noqa: S105

        mock.return_value = self.dummy_response
        await self.service._delete("/resource/123")

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "DELETE")
        self.assertEqual(request.url, "https://test.local/resource/123")

        self.assertIn("Authorization", request.headers)
        self.assertEqual(request.headers["Authorization"], "Bearer dp-token123")

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

        now = datetime.now(timezone.utc)
        await self.service._save_access_token(response)

        self.assertEqual(DevopnessBaseServiceAsync._access_token, "abc")
        self.assertEqual(DevopnessBaseServiceAsync._refresh_token, "def")
        self.assertIsNotNone(DevopnessBaseServiceAsync._token_expires_at)

        expected = now + timedelta(seconds=3600)
        actual = DevopnessBaseServiceAsync._token_expires_at

        delta_seconds = abs((expected - actual).total_seconds())  # type: ignore
        self.assertLess(
            delta_seconds,
            1,
            f"Invalid token expiration date. Expected: {expected.isoformat()}. Actual: {actual.isoformat()}.",  # type: ignore
        )
