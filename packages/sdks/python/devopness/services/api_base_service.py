"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

import httpx


class ApiBaseService:
    """
    A base service class for communicating with the Devopness API.
    """

    client: httpx.AsyncClient

    def __init__(self) -> None:
        self.client = httpx.AsyncClient(
            # TODO: add support for API Client configuration
            base_url="https://api.devopness.com",
            timeout=30000,
            default_encoding="utf-8",
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        )

    async def delete(self, endpoint: str) -> httpx.Response:
        """
        Perform an HTTP DELETE request.

        Args:
            endpoint (str): The relative path of the API endpoint.

        Returns:
            httpx.Response: The response from the API.
        """
        return await self.client.delete(endpoint)

    async def get(self, endpoint: str) -> httpx.Response:
        """
        Perform an HTTP GET request.

        Args:
            endpoint (str): The relative path of the API endpoint.

        Returns:
            httpx.Response: The response from the API.
        """
        return await self.client.get(endpoint)

    async def post(self, endpoint: str, data=None) -> httpx.Response:
        """
        Perform an HTTP POST request with optional JSON data.

        Args:
            endpoint (str): The relative path of the API endpoint.
            data (Any, optional): Data to be sent in the request body.
                                  Can be a dictionary or an object
                                  with a `.dict()` method.

        Returns:
            httpx.Response: The response from the API.
        """
        payload = data.dict() if hasattr(data, "dict") else data  # type: ignore

        return await self.client.post(endpoint, json=payload)

    async def put(self, endpoint: str, data=None) -> httpx.Response:
        """
        Perform an HTTP PUT request with optional JSON data.

        Args:
            endpoint (str): The relative path of the API endpoint.
            data (Any, optional): Data to be sent in the request body.
                                  Can be a dictionary or an object
                                  with a `.dict()` method.

        Returns:
            httpx.Response: The response from the API.
        """
        payload = data.dict() if hasattr(data, "dict") else data  # type: ignore

        return await self.client.put(endpoint, json=payload)
