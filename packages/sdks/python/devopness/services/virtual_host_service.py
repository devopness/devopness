"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.virtual_hosts_api import (
    VirtualHostsApiService,
    VirtualHostsApiServiceAsync,
)

__all__ = ["VirtualHostService", "VirtualHostServiceAsync"]


class VirtualHostService(
    VirtualHostsApiService,
):
    """Service for virtual hosts in the Devopness API."""


class VirtualHostServiceAsync(
    VirtualHostsApiServiceAsync,
):
    """Service for virtual hosts in the Devopness API."""
