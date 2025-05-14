"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.servers_api import (
    ServersApiService,
    ServersApiServiceAsync,
)

__all__ = ["ServerService", "ServerServiceAsync"]


class ServerService(
    ServersApiService,
):
    """Service for servers in the Devopness API."""


class ServerServiceAsync(
    ServersApiServiceAsync,
):
    """Async service for servers in the Devopness API."""
