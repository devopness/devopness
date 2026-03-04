"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.roles_api import (
    RolesApiService,
    RolesApiServiceAsync,
)

__all__ = ["RoleService", "RoleServiceAsync"]


class RoleService(
    RolesApiService,
):
    """Service for roles in the Devopness API."""


class RoleServiceAsync(
    RolesApiServiceAsync,
):
    """Async service for roles in the Devopness API."""
