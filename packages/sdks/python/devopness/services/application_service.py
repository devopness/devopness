"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.applications_api import (
    ApplicationsApiService,
    ApplicationsApiServiceAsync,
)
from ..generated.api.applications_hooks_api import (
    ApplicationsHooksApiService,
    ApplicationsHooksApiServiceAsync,
)

__all__ = ["ApplicationService", "ApplicationServiceAsync"]


class ApplicationService(
    ApplicationsApiService,
    ApplicationsHooksApiService,
):
    """Service for applications in the Devopness API."""


class ApplicationServiceAsync(
    ApplicationsApiServiceAsync,
    ApplicationsHooksApiServiceAsync,
):
    """Async service for applications in the Devopness API."""
