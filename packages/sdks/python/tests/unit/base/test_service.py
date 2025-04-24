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
    def test_perform_unauthenticated_request_expects_not_include_auth_header(
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
    def test_perform_authenticated_request_expects_include_auth_header(
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
    def test_perform_post_request_with_dict_with_keys_unset_expects_this_keys_is_removed_from_payload(
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
    def test_perform_post_request_with_sdk_model_with_keys_unset_expects_this_keys_is_removed_from_payload(
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
    def test_perform_put_request_with_dict_with_keys_unset_expects_this_keys_is_removed_from_payload(
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
    def test_perform_put_request_with_sdk_model_with_keys_unset_expects_this_keys_is_removed_from_payload(
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


class TestDevopnessBaseServiceAsync(unittest.IsolatedAsyncioTestCase):
    config = DevopnessClientConfig(base_url="https://test.local")
    service = DevopnessBaseService(config)

    dummy_request = httpx.Request("", "")
    dummy_response = httpx.Response(200, request=dummy_request)

    @patch("httpx.AsyncClient._send_single_request")
    async def test_perform_unauthenticated_request_expects_not_include_auth_header(
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
    async def test_perform_authenticated_request_expects_include_auth_header(
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
    async def test_perform_post_request_with_dict_with_keys_unset_expects_this_keys_is_removed_from_payload(
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
    async def test_perform_post_request_with_sdk_model_with_keys_unset_expects_this_keys_is_removed_from_payload(
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
    async def test_perform_put_request_with_dict_with_keys_unset_expects_this_keys_is_removed_from_payload(
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
    async def test_perform_put_request_with_sdk_model_with_keys_unset_expects_this_keys_is_removed_from_payload(
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
