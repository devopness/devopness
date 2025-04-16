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

    async def get(self, endpoint: str) -> httpx.Response:
        return await self.client.get(endpoint)
