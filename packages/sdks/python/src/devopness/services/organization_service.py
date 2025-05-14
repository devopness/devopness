"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.organizations_api import (
    OrganizationsApiService,
    OrganizationsApiServiceAsync,
)

__all__ = ["OrganizationService", "OrganizationServiceAsync"]


class OrganizationService(
    OrganizationsApiService,
):
    """Service for organizations in the Devopness API."""


class OrganizationServiceAsync(
    OrganizationsApiServiceAsync,
):
    """Async service for organizations in the Devopness API."""
