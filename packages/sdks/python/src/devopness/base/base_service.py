"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union

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

__all__ = [
    "DevopnessBaseService",
    "DevopnessBaseServiceAsync",
]


class DevopnessBaseService:
    """
    Base service class for communicating with the Devopness API.
    Handles HTTP requests, access token management, and request interception.
    """

    _client: httpx.Client
    _config: DevopnessClientConfig

    _access_token: Optional[str] = None
    _refresh_token: Optional[str] = None
    _token_expires_at: Optional[datetime] = None

    def __init__(self) -> None:
        """
        Initializes the API base service with the provided configuration.
        """
        if DevopnessBaseService._config is None:
            raise DevopnessSdkError("DevopnessBaseService is not initialized")

        self._client = httpx.Client(
            base_url=self._config.base_url,
            timeout=self._config.timeout,
            default_encoding=self._config.default_encoding,
            headers=self._config.headers,
            event_hooks={
                "request": [self._on_request_callback],
                "response": [self._on_response_callback],
            },
        )

    @handle_network_errors_sync
    def _get(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP GET request to the specified endpoint.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return self._client.get(endpoint)

    @handle_network_errors_sync
    def _post(self, endpoint: str, data: Any = None) -> httpx.Response:  # noqa: ANN401
        """
        Sends an HTTP POST request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = parse_payload(data)
        return self._client.post(endpoint, json=payload)

    @handle_network_errors_sync
    def _put(self, endpoint: str, data: Any = None) -> httpx.Response:  # noqa: ANN401
        """
        Sends an HTTP PUT request with optional JSON body.

        Args:
            endpoint (str): The relative URL path.
            data (Any, optional): The request body payload.

        Returns:
            httpx.Response: The HTTP response object.
        """
        payload = parse_payload(data)
        return self._client.put(endpoint, json=payload)

    @handle_network_errors_sync
    def _delete(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP DELETE request.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return self._client.delete(endpoint)

    def _refresh_access_token(self) -> None:
        """
        Refreshes the access token.
        """
        response = self._post(
            "/users/refresh-token",
            {"refresh_token": DevopnessBaseService._refresh_token},
        )

        self._save_access_token(response)

    def _save_access_token(
        self,
        response: httpx.Response,
    ) -> None:
        """
        Saves the access token and its expiration time.
        """
        response.read()
        data = response.json()

        now = datetime.now(timezone.utc)
        expires_in: int = data["expires_in"]
        expires_at = now + timedelta(seconds=expires_in)

        DevopnessBaseService._access_token = data["access_token"]
        DevopnessBaseService._refresh_token = data["refresh_token"]
        DevopnessBaseService._token_expires_at = expires_at

    def _on_request_callback(self, request: httpx.Request) -> None:
        """
        Request interceptor that injects the Authorization header if an access
        token exists.

        Args:
            request (httpx.Request): The outgoing HTTP request.
        """
        if (
            DevopnessBaseService._config.auto_refresh_token
            and is_access_token_expired(DevopnessBaseService)
            and not is_token_change_request(request.url.path)
        ):
            self._refresh_access_token()

        access_token = DevopnessBaseService._access_token

        if access_token:
            request.headers["Authorization"] = f"Bearer {access_token}"

        elif "Authorization" in request.headers:
            del request.headers["Authorization"]

        if DevopnessBaseService._config.debug:
            debug_request(request)

    def _on_response_callback(self, response: httpx.Response) -> httpx.Response:
        """
        Response interceptor to error handling.

        Args:
            response (httpx.Response): The response object from the API.

        Returns:
            httpx.Response: The processed response.
        """
        try:
            response.raise_for_status()

            if (
                DevopnessBaseService._config.auto_refresh_token
                and is_token_change_request(response.url.path)
            ):
                self._save_access_token(response)

            if DevopnessBaseService._config.debug:
                debug_response(response)

        except httpx.HTTPStatusError as e:
            raise_devopness_api_error_sync(e)

        return response


class DevopnessBaseServiceAsync:
    """
    Base service class for communicating with the Devopness API.
    Handles HTTP requests, access token management, and request interception.
    """

    _client: httpx.AsyncClient
    _config: DevopnessClientConfig

    _access_token: Optional[str] = None
    _refresh_token: Optional[str] = None
    _token_expires_at: Optional[datetime] = None

    def __init__(self) -> None:
        """
        Initializes the API base service with the provided configuration.
        """
        if DevopnessBaseServiceAsync._config is None:
            raise DevopnessSdkError("DevopnessBaseServiceAsync is not initialized")

        self._client = httpx.AsyncClient(
            base_url=self._config.base_url,
            timeout=self._config.timeout,
            default_encoding=self._config.default_encoding,
            headers=self._config.headers,
            event_hooks={
                "request": [self._on_request_callback],
                "response": [self._on_response_callback],
            },
        )

    @handle_network_errors
    async def _get(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP GET request to the specified endpoint.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return await self._client.get(endpoint)

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
        payload = parse_payload(data)
        return await self._client.post(endpoint, json=payload)

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
        payload = parse_payload(data)
        return await self._client.put(endpoint, json=payload)

    @handle_network_errors
    async def _delete(self, endpoint: str) -> httpx.Response:
        """
        Sends an HTTP DELETE request.

        Args:
            endpoint (str): The relative URL path.

        Returns:
            httpx.Response: The HTTP response object.
        """
        return await self._client.delete(endpoint)

    async def _refresh_access_token(self) -> None:
        """
        Refreshes the access token.
        """
        response = await self._post(
            "/users/refresh-token",
            {"refresh_token": DevopnessBaseServiceAsync._refresh_token},
        )

        await self._save_access_token(response)

    async def _save_access_token(
        self,
        response: httpx.Response,
    ) -> None:
        """
        Saves the access token and its expiration time.
        """
        await response.aread()
        data = response.json()

        now = datetime.now(timezone.utc)
        expires_in: int = data["expires_in"]
        expires_at = now + timedelta(seconds=expires_in)

        DevopnessBaseServiceAsync._access_token = data["access_token"]
        DevopnessBaseServiceAsync._refresh_token = data["refresh_token"]
        DevopnessBaseServiceAsync._token_expires_at = expires_at

    async def _on_request_callback(self, request: httpx.Request) -> None:
        """
        Request interceptor that injects the Authorization header if an access
        token exists.

        Args:
            request (httpx.Request): The outgoing HTTP request.
        """
        if (
            DevopnessBaseServiceAsync._config.auto_refresh_token
            and is_access_token_expired(DevopnessBaseServiceAsync)
            and not is_token_change_request(request.url.path)
        ):
            await self._refresh_access_token()

        access_token = DevopnessBaseServiceAsync._access_token

        if access_token:
            request.headers["Authorization"] = f"Bearer {access_token}"

        elif "Authorization" in request.headers:
            del request.headers["Authorization"]

        if DevopnessBaseServiceAsync._config.debug:
            debug_request(request)

    async def _on_response_callback(self, response: httpx.Response) -> httpx.Response:
        """
        Response interceptor to error handling.

        Args:
            response (httpx.Response): The response object from the API.

        Returns:
            httpx.Response: The processed response.
        """
        try:
            response.raise_for_status()

            if (
                DevopnessBaseServiceAsync._config.auto_refresh_token
                and is_token_change_request(response.url.path)
            ):
                await self._save_access_token(response)

            if DevopnessBaseServiceAsync._config.debug:
                debug_response(response)

        except httpx.HTTPStatusError as e:
            await raise_devopness_api_error(e)

        return response


def debug_request(request: httpx.Request) -> None:
    """
    Prints the request details to the console.

    Args:
        request (httpx.Request): The request object.
    """
    r_method = request.method.upper()
    r_url = request.url

    print(f"[Devopness SDK] --> {r_method} {r_url}")


def debug_response(response: httpx.Response) -> None:
    """
    Prints the response details to the console.

    Args:
        response (httpx.Response): The response object.
    """
    r_status_code = response.status_code
    r_reason_phrase = response.reason_phrase

    print(f"[Devopness SDK] <-- [Response] {r_status_code} {r_reason_phrase}")


def is_access_token_expired(
    service_cls: Union[
        type[DevopnessBaseService],
        type[DevopnessBaseServiceAsync],
    ],
) -> bool:
    """
    Checks if the access token has expired.
    """
    expires_at = service_cls._token_expires_at
    if expires_at is None:
        return True

    safety_margin = timedelta(seconds=30)
    return datetime.now(timezone.utc) >= (expires_at - safety_margin)


def is_token_change_request(endpoint: str) -> bool:
    """
    Checks if the request is to a endpoint that updates the access token.
    """
    return endpoint in [
        "/users/login",
        "/users/refresh-token",
    ]


def parse_payload(
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
