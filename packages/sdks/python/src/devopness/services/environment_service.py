"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.environments_api import (
    EnvironmentsApiService,
    EnvironmentsApiServiceAsync,
)
from ..generated.api.organizations_environments_api import (
    OrganizationsEnvironmentsApiService,
    OrganizationsEnvironmentsApiServiceAsync,
)
from ..generated.api.projects_archived_environments_api import (
    ProjectsArchivedEnvironmentsApiService,
    ProjectsArchivedEnvironmentsApiServiceAsync,
)
from ..generated.api.projects_environments_api import (
    ProjectsEnvironmentsApiService,
    ProjectsEnvironmentsApiServiceAsync,
)
from ..generated.api.users_environments_api import (
    UsersEnvironmentsApiService,
    UsersEnvironmentsApiServiceAsync,
)

__all__ = ["EnvironmentService", "EnvironmentServiceAsync"]


class EnvironmentService(
    EnvironmentsApiService,
    ProjectsArchivedEnvironmentsApiService,
    ProjectsEnvironmentsApiService,
    UsersEnvironmentsApiService,
    OrganizationsEnvironmentsApiService,
):
    """Service for environments in the Devopness API."""


class EnvironmentServiceAsync(
    EnvironmentsApiServiceAsync,
    ProjectsArchivedEnvironmentsApiServiceAsync,
    ProjectsEnvironmentsApiServiceAsync,
    UsersEnvironmentsApiServiceAsync,
    OrganizationsEnvironmentsApiServiceAsync,
):
    """Async service for environments in the Devopness API."""
