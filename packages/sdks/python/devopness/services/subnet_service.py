"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.networks_subnets_api import NetworksSubnetsApiService
from ..generated.api.subnets_api import SubnetsApiService

__all__ = ["SubnetService"]

# pylint: disable=missing-class-docstring


class SubnetService(
    SubnetsApiService,
    NetworksSubnetsApiService,
):
    pass
