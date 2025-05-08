"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.services_api import (
    ServicesApiService,
    ServicesApiServiceAsync,
)

__all__ = ["ServiceService", "ServiceServiceAsync"]


class ServiceService(
    ServicesApiService,
):
    """Service for services in the Devopness API."""


class ServiceServiceAsync(
    ServicesApiServiceAsync,
):
    """Async service for services in the Devopness API."""
