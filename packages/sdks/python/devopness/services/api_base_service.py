"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Optional, Any

import httpx
from pydantic import BaseModel, ConfigDict


class DevopnessClientConfig(BaseModel):
    """
    Configuration model for Devopness API client.

    Attributes:
        base_url (str): Base URL for API requests.
        timeout (int): Request timeout in seconds.
        default_encoding (str): Default encoding for response content.
        headers (dict[str, str]): Default headers for API requests.
    """

    base_url: str = "https://api.devopness.com"
    timeout: int = 30
    default_encoding: str = "utf-8"
    headers: dict[str, str] = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    model_config = ConfigDict()


class ApiBaseService:
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
        access_token = ApiBaseService._access_token

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

        if response.status_code >= 400 and response.status_code < 500:
            # Handle client-side errors (4xx)
            raise RuntimeError(f"Client Error: {response.status_code}")

        elif response.status_code >= 500:
            # Handle server-side errors (5xx)
            raise RuntimeError(f"Server Error: {response.status_code}")

        return response

    async def _get(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP GET request to the specified endpoint.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return await self.__client.get(endpoint)

    async def _post(self, endpoint: str, data: Any = None) -> httpx.Response:
        """
        Sends an HTTP POST request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = data.dict() if hasattr(data, "dict") else data
        return await self.__client.post(endpoint, json=payload)

    async def _put(self, endpoint: str, data: Any = None) -> httpx.Response:
        """
        Sends an HTTP PUT request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = data.dict() if hasattr(data, "dict") else data
        return await self.__client.put(endpoint, json=payload)

    async def _delete(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP DELETE request.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return await self.__client.delete(endpoint)

    def __on_request_sync(self, request: httpx.Request) -> None:
        """
        Request interceptor that injects the Authorization header if an access
        token exists.

        Args:
            request (httpx.Request): The outgoing HTTP request.
        """
        access_token = ApiBaseService._access_token

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

        if response.status_code >= 400 and response.status_code < 500:
            # Handle client-side errors (4xx)
            raise RuntimeError(f"Client Error: {response.status_code}")

        elif response.status_code >= 500:
            # Handle server-side errors (5xx)
            raise RuntimeError(f"Server Error: {response.status_code}")

        return response

    def _get_sync(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP GET request to the specified endpoint.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return self.__client_sync.get(endpoint)

    def _post_sync(self, endpoint: str, data: Any = None) -> httpx.Response:
        """
        Sends an HTTP POST request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = data.dict() if hasattr(data, "dict") else data
        return self.__client_sync.post(endpoint, json=payload)

    def _put_sync(self, endpoint: str, data: Any = None) -> httpx.Response:
        """
        Sends an HTTP PUT request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = data.dict() if hasattr(data, "dict") else data
        return self.__client_sync.put(endpoint, json=payload)

    def _delete_sync(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP DELETE request.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return self.__client_sync.delete(endpoint)
