"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.services_api import ServicesApiService

__all__ = ["ServiceService"]

# pylint: disable=missing-class-docstring


class ServiceService(
    ServicesApiService,
):
    """Service for services in the Devopness API."""
