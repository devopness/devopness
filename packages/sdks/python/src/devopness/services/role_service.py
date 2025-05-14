"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.projects_roles_api import (
    ProjectsRolesApiService,
    ProjectsRolesApiServiceAsync,
)
from ..generated.api.roles_api import (
    RolesApiService,
    RolesApiServiceAsync,
)

__all__ = ["RoleService", "RoleServiceAsync"]


class RoleService(
    RolesApiService,
    ProjectsRolesApiService,
):
    """Service for roles in the Devopness API."""


class RoleServiceAsync(
    RolesApiServiceAsync,
    ProjectsRolesApiServiceAsync,
):
    """Async service for roles in the Devopness API."""
