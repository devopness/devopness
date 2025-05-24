"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.networks_subnets_api import (
    NetworksSubnetsApiService,
    NetworksSubnetsApiServiceAsync,
)
from ..generated.api.subnets_api import (
    SubnetsApiService,
    SubnetsApiServiceAsync,
)

__all__ = ["SubnetService", "SubnetServiceAsync"]


class SubnetService(
    SubnetsApiService,
    NetworksSubnetsApiService,
):
    """Service for subnets in the Devopness API."""


class SubnetServiceAsync(
    SubnetsApiServiceAsync,
    NetworksSubnetsApiServiceAsync,
):
    """Async service for subnets in the Devopness API."""
