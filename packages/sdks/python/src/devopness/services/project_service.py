"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.organizations_projects_api import (
    OrganizationsProjectsApiService,
    OrganizationsProjectsApiServiceAsync,
)
from ..generated.api.projects_api import (
    ProjectsApiService,
    ProjectsApiServiceAsync,
)
from ..generated.api.users_projects_api import (
    UsersProjectsApiService,
    UsersProjectsApiServiceAsync,
)

__all__ = ["ProjectService", "ProjectServiceAsync"]


class ProjectService(
    ProjectsApiService,
    UsersProjectsApiService,
    OrganizationsProjectsApiService,
):
    """Service for projects in the Devopness API."""


class ProjectServiceAsync(
    ProjectsApiServiceAsync,
    UsersProjectsApiServiceAsync,
    OrganizationsProjectsApiServiceAsync,
):
    """Async service for projects in the Devopness API."""
