import unittest
from unittest.mock import Mock, patch

import httpx

from devopness.core import DevopnessApiError


class DevopnessApiErrorTests(unittest.TestCase):
    @patch("httpx.Client.post")
    def test_devopness_api_error_with_validation_errors(
        self,
        mock: Mock,
    ) -> None:
        url = "https://api.devopness.com/projects"
        mock.return_value = httpx.Response(
            status_code=422,
            json={
                "message": "Validation failed",
                "errors": {
                    "name": ["This field is required."],
                    "description": ["Must be at least 10 characters."],
                },
            },
            request=httpx.Request("POST", url),
        )

        with httpx.Client() as client:
            response = client.post(url)

            with self.assertRaises(httpx.HTTPStatusError) as raises:
                response.raise_for_status()

            error = DevopnessApiError(raises.exception)

            assert error.request_url == url
            assert error.request_method == "POST"

            assert error.status_code == 422
            assert error.message == "Validation failed"

            assert error.errors is not None
            assert "name" in error.errors
            assert "description" in error.errors

            string_output = str(error)
            assert (
                "\nDevopness SDK Error: API Request Failed\n\n"
                "Request: POST https://api.devopness.com/projects\n"
                "Status Code: 422\n"
                "Message: Validation failed\n"
                "Errors:\n"
                "  - name:\n"
                "      This field is required.\n"
                "  - description:\n"
                "      Must be at least 10 characters."
            ) in string_output

    @patch("httpx.Client.get")
    def test_devopness_api_error_with_simple_error_message(
        self,
        mock: Mock,
    ) -> None:
        url = "https://api.devopness.com/users"
        mock.return_value = httpx.Response(
            status_code=404,
            json={"message": "Not Found"},
            request=httpx.Request("GET", url),
        )

        with httpx.Client() as client:
            response = client.get(url)

            with self.assertRaises(httpx.HTTPStatusError) as raises:
                response.raise_for_status()

            error = DevopnessApiError(raises.exception)

            assert error.status_code == 404
            assert error.message == "Not Found"

            assert error.errors is None

            assert error.request_url == url
            assert error.request_method == "GET"

            string_output = str(error)
            assert (
                "\nDevopness SDK Error: API Request Failed\n\n"
                "Request: GET https://api.devopness.com/users\n"
                "Status Code: 404\n"
                "Message: Not Found"
            ) in string_output

    @patch("httpx.Client.delete")
    def test_devopness_api_error_with_non_json_response(
        self,
        mock: Mock,
    ) -> None:
        url = "https://api.devopness.com/forbidden"
        mock.return_value = httpx.Response(
            status_code=403,
            content=b"Access denied",
            headers={"Content-Type": "text/plain"},
            request=httpx.Request("DELETE", url),
        )

        with httpx.Client() as client:
            response = client.delete(url)

            with self.assertRaises(httpx.HTTPStatusError) as raises:
                response.raise_for_status()

            error = DevopnessApiError(raises.exception)

            assert error.status_code == 403
            assert "403 Forbidden" in error.message

            assert error.errors is None

            assert error.response_text == "Access denied"
            assert "Access denied" not in error.message

            string_output = str(error)
            assert (
                "\nDevopness SDK Error: API Request Failed\n\n"
                "Request: DELETE https://api.devopness.com/forbidden\n"
                "Status Code: 403\n"
                "Message: Client error '403 Forbidden'"
            ) in string_output

    @patch("httpx.Client.put")
    def test_devopness_api_error_with_empty_json(
        self,
        mock: Mock,
    ) -> None:
        url = "https://api.devopness.com/bad"
        mock.return_value = httpx.Response(
            status_code=400,
            json={"foo": "bar"},
            request=httpx.Request("PUT", url),
        )

        with httpx.Client() as client:
            response = client.put(url)

            with self.assertRaises(httpx.HTTPStatusError) as raises:
                response.raise_for_status()

            error = DevopnessApiError(raises.exception)

            assert error.status_code == 400
            assert "400 Bad Request" in error.message

            assert error.errors is None

            string_output = str(error)
            assert (
                "\nDevopness SDK Error: API Request Failed\n\n"
                "Request: PUT https://api.devopness.com/bad\n"
                "Status Code: 400\n"
                "Message: Client error '400 Bad Request'"
            ) in string_output

    @patch("httpx.Client.get")
    def test_devopness_api_error_with_blank_message_falls_back_to_httpx(
        self,
        mock: Mock,
    ) -> None:
        url = "https://api.devopness.com/empty"
        mock.return_value = httpx.Response(
            status_code=500,
            json={"message": " "},
            request=httpx.Request("GET", url),
        )

        with httpx.Client() as client:
            response = client.get(url)

            with self.assertRaises(httpx.HTTPStatusError) as raises:
                response.raise_for_status()

            error = DevopnessApiError(raises.exception)

            assert error.status_code == 500
            assert "500 Internal Server Error" in error.message

            assert error.errors is None

            string_output = str(error)
            assert (
                "\nDevopness SDK Error: API Request Failed\n\n"
                "Request: GET https://api.devopness.com/empty\n"
                "Status Code: 500\n"
                "Message: Server error '500 Internal Server Error'"
            ) in string_output
