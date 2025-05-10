"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.networks_api import (
    NetworksApiService,
    NetworksApiServiceAsync,
)

__all__ = ["NetworkService", "NetworkServiceAsync"]


class NetworkService(
    NetworksApiService,
):
    """Service for networks in the Devopness API."""


class NetworkServiceAsync(
    NetworksApiServiceAsync,
):
    """Async service for networks in the Devopness API."""
