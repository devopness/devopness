"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Any, Optional, Union
from urllib.parse import urlencode

import httpx

from devopness.core.sdk_error import DevopnessSdkError

from ..base import DevopnessBaseModel
from ..client_config import DevopnessClientConfig
from ..core.api_error import (
    raise_devopness_api_error,
    raise_devopness_api_error_sync,
)
from ..core.network_error import (
    handle_network_errors,
    handle_network_errors_sync,
)

__all__ = ["DevopnessBaseService"]


class DevopnessBaseService:
    """
    Base service class for communicating with the Devopness API.
    Handles HTTP requests, access token management, and request interception.
    """

    __client: httpx.AsyncClient
    __client_sync: httpx.Client

    _config: DevopnessClientConfig

    _access_token: Optional[str] = None
    _refresh_token: Optional[str] = None
    _expires_in: Optional[int] = None

    def __init__(self) -> None:
        """
        Initializes the API base service with the provided configuration.
        """
        if self._config is None:
            raise DevopnessSdkError("DevopnessBaseService is not initialized")

        self.__client = httpx.AsyncClient(
            base_url=self._config.base_url,
            timeout=self._config.timeout,
            default_encoding=self._config.default_encoding,
            headers=self._config.headers,
            event_hooks={
                "request": [self.__on_request],
                "response": [self.__on_response],
            },
        )

        self.__client_sync = httpx.Client(
            base_url=self._config.base_url,
            timeout=self._config.timeout,
            default_encoding=self._config.default_encoding,
            headers=self._config.headers,
            event_hooks={
                "request": [self.__on_request_sync],
                "response": [self.__on_response_sync],
            },
        )

    async def __on_request(self, request: httpx.Request) -> None:
        """
        Request interceptor that injects the Authorization header if an access
        token exists.

        Args:
            request (httpx.Request): The outgoing HTTP request.
        """
        access_token = DevopnessBaseService._access_token

        if access_token:
            request.headers["Authorization"] = f"Bearer {access_token}"

        elif "Authorization" in request.headers:
            del request.headers["Authorization"]

        if self._config.debug:
            self.__debug_request(request)

    async def __on_response(self, response: httpx.Response) -> httpx.Response:
        """
        Response interceptor to error handling.

        Args:
            response (httpx.Response): The response object from the API.

        Returns:
            httpx.Response: The processed response.
        """
        try:
            response.raise_for_status()

            if self._config.debug:
                self.__debug_response(response)

        except httpx.HTTPStatusError as e:
            await raise_devopness_api_error(e)

        return response

    def __on_request_sync(self, request: httpx.Request) -> None:
        """
        Request interceptor that injects the Authorization header if an access
        token exists.

        Args:
            request (httpx.Request): The outgoing HTTP request.
        """
        if self._config.auto_refresh_token and request.url.path not in [
            "/users/login",
            "/users/refresh-token",
        ]:
            self.__refresh_token()

        access_token = DevopnessBaseService._access_token

        if access_token:
            request.headers["Authorization"] = f"Bearer {access_token}"

        elif "Authorization" in request.headers:
            del request.headers["Authorization"]

        if self._config.debug:
            self.__debug_request(request)

    def __on_response_sync(self, response: httpx.Response) -> httpx.Response:
        """
        Response interceptor to error handling.

        Args:
            response (httpx.Response): The response object from the API.

        Returns:
            httpx.Response: The processed response.
        """
        try:
            response.raise_for_status()

            if self._config.auto_refresh_token and response.url.path in [
                "/users/login",
                "/users/refresh-token",
            ]:
                self.__refresh_token(response)

            if self._config.debug:
                self.__debug_response(response)

        except httpx.HTTPStatusError as e:
            raise_devopness_api_error_sync(e)

        return response

    @handle_network_errors
    async def _get(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP GET request to the specified endpoint.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return await self.__client.get(endpoint)

    @handle_network_errors
    async def _post(self, endpoint: str, data: Any = None) -> httpx.Response:  # noqa: ANN401
        """
        Sends an HTTP POST request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = self.__get_payload(data)
        return await self.__client.post(endpoint, json=payload)

    @handle_network_errors
    async def _put(self, endpoint: str, data: Any = None) -> httpx.Response:  # noqa: ANN401
        """
        Sends an HTTP PUT request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = self.__get_payload(data)
        return await self.__client.put(endpoint, json=payload)

    @handle_network_errors
    async def _delete(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP DELETE request.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return await self.__client.delete(endpoint)

    @handle_network_errors_sync
    def _get_sync(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP GET request to the specified endpoint.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return self.__client_sync.get(endpoint)

    @handle_network_errors_sync
    def _post_sync(self, endpoint: str, data: Any = None) -> httpx.Response:  # noqa: ANN401
        """
        Sends an HTTP POST request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = self.__get_payload(data)
        return self.__client_sync.post(endpoint, json=payload)

    @handle_network_errors_sync
    def _put_sync(self, endpoint: str, data: Any = None) -> httpx.Response:  # noqa: ANN401
        """
        Sends an HTTP PUT request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = self.__get_payload(data)
        return self.__client_sync.put(endpoint, json=payload)

    @handle_network_errors_sync
    def _delete_sync(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP DELETE request.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return self.__client_sync.delete(endpoint)

    def __get_payload(
        self,
        data: Union[dict[str, Any], DevopnessBaseModel, None],
    ) -> Union[dict[str, Any], None]:
        """
        Returns the payload for a request.

        Args:
            data (Union[dict[str, Any], DevopnessBaseModel, None]): The request body
                                                                    payload.

        Returns:
            str: The payload as a string.
        """
        if data is None:
            return None

        if isinstance(data, DevopnessBaseModel):
            payload = data.model_dump(exclude_unset=True)

        if isinstance(data, dict):
            payload = data

        return payload

    def __debug_request(self, request: httpx.Request) -> None:
        """
        Prints the request details to the console.

        Args:
            request (httpx.Request): The request object.
        """
        r_method = request.method.upper()
        r_url = request.url

        print(f"[Devopness SDK] --> {r_method} {r_url}")

    def __debug_response(self, response: httpx.Response) -> None:
        """
        Prints the response details to the console.

        Args:
            response (httpx.Response): The response object.
        """
        r_status_code = response.status_code
        r_reason_phrase = response.reason_phrase

        print(f"[Devopness SDK] <-- [Response] {r_status_code} {r_reason_phrase}")

    def __refresh_token(self, response: Optional[httpx.Response] = None) -> None:
        """
        Refreshes the access token.
        """
        res = (
            response
            if response is not None
            else self._post_sync(
                "/users/refresh-token",
                {"refresh_token": self._refresh_token},
            )
        )

        res.read()
        data = res.json()
        DevopnessBaseService._access_token = data["access_token"]
        DevopnessBaseService._refresh_token = data["refresh_token"]
        DevopnessBaseService._expires_in = data["expires_in"]

    @staticmethod
    def _get_query_string(in_params: dict[str, Any]) -> str:
        """
        Returns the query string from the given query parameters.

        Args:
            in_params (dict[str, Any]): The query parameters.

        Returns:
            str: The query string.
        """
        out_params: dict[str, Any] = {}
        for key, value in in_params.items():
            if value is None or value in ("", [], {}):
                continue

            out_params[key] = value

        return urlencode(out_params)
