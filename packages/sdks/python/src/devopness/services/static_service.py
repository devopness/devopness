"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.static_data_api import (
    StaticDataApiService,
    StaticDataApiServiceAsync,
)

__all__ = ["StaticService", "StaticServiceAsync"]


class StaticService(
    StaticDataApiService,
):
    """Service for static data in the Devopness API."""


class StaticServiceAsync(
    StaticDataApiServiceAsync,
):
    """Async service for static data in the Devopness API."""
