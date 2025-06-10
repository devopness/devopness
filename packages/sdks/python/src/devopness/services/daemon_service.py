"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.daemons_api import (
    DaemonsApiService,
    DaemonsApiServiceAsync,
)

__all__ = ["DaemonService", "DaemonServiceAsync"]


class DaemonService(
    DaemonsApiService,
):
    """Service for daemons in the Devopness API."""


class DaemonServiceAsync(
    DaemonsApiServiceAsync,
):
    """Async service for daemons in the Devopness API."""
