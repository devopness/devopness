import unittest
from unittest.mock import Mock, patch

import httpx

from devopness import DevopnessClientConfig
from devopness._base import DevopnessBaseService
from devopness.models import ProjectCreate, ProjectUpdate


class TestDevopnessBaseService(unittest.TestCase):
    config = DevopnessClientConfig(base_url="https://test.local")
    service = DevopnessBaseService(config)

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
        payload = {"name": "John Doe", "age": None}
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
        payload = ProjectCreate(name="Cool Project", organization_id=None)
        self.service._post_sync("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "POST")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"name":"Cool Project"}')

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
        payload = {"name": "John Doe", "age": None}
        self.service._put_sync("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"name":"John Doe"}')

    @patch("httpx.Client.send")
    def test_put_sdk_model_removes_null_fields(
        self,
        mock: Mock,
    ) -> None:
        payload = ProjectUpdate(id=123, name="Cool Project", logo_image=None)
        self.service._put_sync("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"id":123,"name":"Cool Project"}')

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


class TestDevopnessBaseServiceAsync(unittest.IsolatedAsyncioTestCase):
    config = DevopnessClientConfig(base_url="https://test.local")
    service = DevopnessBaseService(config)

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
        payload = {"name": "John Doe", "age": None}
        await self.service._post("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "POST")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"name":"John Doe"}')

    @patch("httpx.AsyncClient.send")
    async def test_post_sdk_model_removes_null_fields(
        self,
        mock: Mock,
    ) -> None:
        payload = ProjectCreate(name="Cool Project", organization_id=None)
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
        payload = {"name": "John Doe", "age": None}
        await self.service._put("/resource", payload)

        mock.assert_called_once()

        request: httpx.Request = mock.call_args[0][0]
        self.assertIsInstance(request, httpx.Request)

        self.assertEqual(request.method, "PUT")
        self.assertEqual(request.url, "https://test.local/resource")

        self.assertEqual(request.headers["Content-Type"], "application/json")
        self.assertEqual(request.content, b'{"name":"John Doe"}')

    @patch("httpx.AsyncClient.send")
    async def test_put_sdk_model_removes_null_fields(
        self,
        mock: Mock,
    ) -> None:
        payload = ProjectUpdate(id=123, name="Cool Project", logo_image=None)
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
