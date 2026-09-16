"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from dataclasses import dataclass
from datetime import datetime
from typing import TYPE_CHECKING, NoReturn

import httpx

if TYPE_CHECKING:
    from .client_config import DevopnessClientConfig

DEVOPNESS_CLIENT_STATE_EXTENSION_KEY = "devopness_client_state"


@dataclass
class DevopnessClientState:
    """
    Per-client runtime state for Devopness SDK instances.

    This groups the immutable client configuration with mutable runtime data
    such as access tokens and token expiration timestamps.
    """

    config: "DevopnessClientConfig"

    http_client: httpx.Client | None = None
    http_client_async: httpx.AsyncClient | None = None

    access_token: str | None = None
    refresh_token: str | None = None
    token_expires_at: datetime | None = None

    def setup_http_client(self, is_async_client: bool) -> None:
        def event_hook_placeholder(request: httpx.Request) -> NoReturn:
            raise NotImplementedError(
                "The event hooks of the httpx client "
                "must be set before the client is used."
            )

        if is_async_client:
            self.http_client_async = httpx.AsyncClient(
                base_url=self.config.base_url,
                timeout=self.config.timeout,
                default_encoding=self.config.default_encoding,
                headers=dict(self.config.headers),
                event_hooks={
                    "request": [event_hook_placeholder],
                    "response": [event_hook_placeholder],
                },
            )
            return

        self.http_client = httpx.Client(
            base_url=self.config.base_url,
            timeout=self.config.timeout,
            default_encoding=self.config.default_encoding,
            headers=dict(self.config.headers),
            event_hooks={
                "request": [event_hook_placeholder],
                "response": [event_hook_placeholder],
            },
        )

    def close(self) -> None:
        if self.http_client is not None:
            self.http_client.close()
            self.http_client = None

    async def aclose(self) -> None:
        if self.http_client_async is not None:
            await self.http_client_async.aclose()
            self.http_client_async = None
