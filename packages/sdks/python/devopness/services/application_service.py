"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.applications_api import ApplicationsApiService

__all__ = ["ApplicationService"]

# pylint: disable=missing-class-docstring


class ApplicationService(
    ApplicationsApiService,
):
    """Service for applications in the Devopness API."""
