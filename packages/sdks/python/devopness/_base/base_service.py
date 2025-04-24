"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Any, Optional, Union
from urllib.parse import urlencode

import httpx

from .._base import DevopnessBaseModel
from .._client_config import DevopnessClientConfig
from .._core.api_error import (
    raise_devopness_api_error,
    raise_devopness_api_error_sync,
)
from .._core.network_error import (
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

    _access_token: Optional[str] = None

    def __init__(self, config: DevopnessClientConfig) -> None:
        """
        Initializes the API base service with the provided configuration.

        Args:
            config (DevopnessApiClientConfig): Client configuration object.
        """
        self.__client = httpx.AsyncClient(
            base_url=config.base_url,
            timeout=config.timeout,
            default_encoding=config.default_encoding,
            headers=config.headers,
            event_hooks={
                "request": [self.__on_request],
                "response": [self.__on_response],
            },
        )

        self.__client_sync = httpx.Client(
            base_url=config.base_url,
            timeout=config.timeout,
            default_encoding=config.default_encoding,
            headers=config.headers,
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
        access_token = DevopnessBaseService._access_token

        if access_token:
            request.headers["Authorization"] = f"Bearer {access_token}"

        elif "Authorization" in request.headers:
            del request.headers["Authorization"]

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
        data: Union[dict[str, Any], DevopnessBaseModel],
    ) -> dict[str, Any]:
        """
        Returns the payload for a request.

        Args:
            data (Union[dict[str, Any], DevopnessBaseModel]): The request body payload.

        Returns:
            str: The payload as a string.
        """
        if isinstance(data, DevopnessBaseModel):
            payload = data.model_dump(exclude_unset=True)

        if isinstance(data, dict):
            payload = data

        stripped_payload = {}
        for key, value in payload.items():
            if value is not None:
                stripped_payload[key] = value

        return stripped_payload

    @staticmethod
    def _get_query_string(params: dict[str, Any]) -> str:
        """
        Returns the query string from the given query parameters.

        Args:
            params (dict[str, Any]): The query parameters.

        Returns:
            str: The query string.
        """
        params = {}
        for key, value in params.items():
            if value is None:
                continue

            params[key] = value

        return urlencode(params)
