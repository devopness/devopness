"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

import httpx


class ApiBaseService:
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
        Performs a DELETE request on the given endpoint.

        :param endpoint: The relative path to the API endpoint
        :return: The response object
        :rtype: httpx.Response
        """
        return await self.client.delete(endpoint)

    async def get(self, endpoint: str) -> httpx.Response:
        """
        Performs a GET request on the given endpoint.

        :param endpoint: The relative path to the API endpoint
        :return: The response object
        :rtype: httpx.Response
        """

        return await self.client.get(endpoint)

    async def post(self, endpoint: str, data=None) -> httpx.Response:
        """
        Performs a POST request on the given endpoint with the provided data.

        :param endpoint: The relative path to the API endpoint
        :param data: The data to be sent in the request body
        :return: The response object
        :rtype: httpx.Response
        """

        return await self.client.post(endpoint, data=data)

    async def put(self, endpoint: str, data=None) -> httpx.Response:
        """
        Performs a PUT request on the given endpoint with the provided data.

        :param endpoint: The relative path to the API endpoint.
        :param data: The data to be sent in the request body.
        :return: The response object.
        :rtype: httpx.Response
        """

        return await self.client.put(endpoint, data=data)
