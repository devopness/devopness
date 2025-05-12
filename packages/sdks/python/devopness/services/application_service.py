"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.applications_api import (
    ApplicationsApiService,
    ApplicationsApiServiceAsync,
)

__all__ = ["ApplicationService", "ApplicationServiceAsync"]


class ApplicationService(
    ApplicationsApiService,
):
    """Service for applications in the Devopness API."""


class ApplicationServiceAsync(
    ApplicationsApiServiceAsync,
):
    """Async service for applications in the Devopness API."""
