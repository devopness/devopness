import unittest
from typing import Optional, Required, TypedDict
from unittest.mock import Mock, patch

import httpx
from pydantic import Field, StrictInt, StrictStr

from devopness import DevopnessClientConfig
from devopness.base import DevopnessBaseModel, DevopnessBaseService
from devopness.core.api_error import DevopnessApiError


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


class TestDevopnessBaseService(unittest.TestCase):
    DevopnessBaseService._config = DevopnessClientConfig(base_url="https://test.local")
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
        self.service._get_sync("/resource")

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
        self.service._delete_sync("/resource/123")

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
        self.service._post_sync("/resource", payload)

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
        self.service._post_sync("/resource", payload)

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
        self.service._post_sync("/resource")

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
        self.service._put_sync("/resource", payload)

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
        self.service._put_sync("/resource", payload)

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
        self.service._put_sync("/resource")

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b"")

    def test_query_string_formatter(self) -> None:
        params = dict(
            string="hello",
            integer=123,
            float=123.456,
            boolean=True,
            list=["a", "b", "c"],
            dict={"a": 1, "b": 2},
            null=None,
            empty_string="",
            empty_list=[],
            empty_dict={},
        )

        query_string = self.service._get_query_string(params)
        expected_query_string = "string=hello"
        expected_query_string += "&integer=123"
        expected_query_string += "&float=123.456"
        expected_query_string += "&boolean=True"
        expected_query_string += "&list=%5B%27a%27%2C+%27b%27%2C+%27c%27%5D"
        expected_query_string += "&dict=%7B%27a%27%3A+1%2C+%27b%27%3A+2%7D"

        self.assertEqual(query_string, expected_query_string)

    @patch("httpx.Client._send_single_request")
    def test_unauthorized_request_without_on_token_expired_callback_should_raise_exception(
        self,
        mock: Mock,
    ) -> None:
        DevopnessBaseService._on_token_expired = None
        DevopnessBaseService._access_token = "devopness-some-token"  # noqa: S105

        mock.return_value = httpx.Response(401, request=self.dummy_request)

        with self.assertRaises(DevopnessApiError) as context:
            self.service._get_sync("/resource")

        self.assertEqual(context.exception.status_code, 401)

    @patch("httpx.Client._send_single_request")
    def test_unauthorized_request_with_on_token_expired_callback_should_call_callback(
        self,
        mock: Mock,
    ) -> None:
        on_token_expired_callback_mock = Mock()

        DevopnessBaseService._on_token_expired = on_token_expired_callback_mock
        DevopnessBaseService._access_token = "devopness-some-token"  # noqa: S105

        mock.return_value = httpx.Response(401, request=self.dummy_request)

        self.service._get_sync("/resource")

        on_token_expired_callback_mock.assert_called_once_with("devopness-some-token")


class TestDevopnessBaseServiceAsync(unittest.IsolatedAsyncioTestCase):
    DevopnessBaseService._config = DevopnessClientConfig(base_url="https://test.local")
    service = DevopnessBaseService()

    dummy_request = httpx.Request("", "")
    dummy_response = httpx.Response(200, request=dummy_request)

    @patch("httpx.AsyncClient._send_single_request")
    async def test_unauthenticated_request_omits_auth_header(
        self,
        mock: Mock,
    ) -> None:
        DevopnessBaseService._access_token = None

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
        DevopnessBaseService._access_token = "dp-token123"  # noqa: S105

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

    @patch("httpx.AsyncClient._send_single_request")
    async def test_unauthorized_request_without_on_token_expired_callback_should_raise_exception(
        self,
        mock: Mock,
    ) -> None:
        DevopnessBaseService._on_token_expired = None
        DevopnessBaseService._access_token = "devopness-some-token"  # noqa: S105

        mock.return_value = httpx.Response(401, request=self.dummy_request)

        with self.assertRaises(DevopnessApiError) as context:
            await self.service._get("/resource")

        self.assertEqual(context.exception.status_code, 401)

    @patch("httpx.AsyncClient._send_single_request")
    async def test_unauthorized_request_with_on_token_expired_callback_should_call_callback(
        self,
        mock: Mock,
    ) -> None:
        on_token_expired_callback_mock = Mock()

        DevopnessBaseService._on_token_expired = on_token_expired_callback_mock
        DevopnessBaseService._access_token = "devopness-some-token"  # noqa: S105

        mock.return_value = httpx.Response(401, request=self.dummy_request)

        await self.service._get("/resource")

        on_token_expired_callback_mock.assert_called_once_with("devopness-some-token")
