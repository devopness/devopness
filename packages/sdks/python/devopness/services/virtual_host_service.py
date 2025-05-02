"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from .._generated.api.virtual_hosts_api import VirtualHostsApiService

__all__ = ["VirtualHostService"]

# pylint: disable=missing-class-docstring


class VirtualHostService(
    VirtualHostsApiService,
):
    pass
