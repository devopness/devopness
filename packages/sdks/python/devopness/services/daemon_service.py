"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.daemons_api import DaemonsApiService

__all__ = ["DaemonService"]

# pylint: disable=missing-class-docstring


class DaemonService(
    DaemonsApiService,
):
    """Service for daemons in the Devopness API."""
