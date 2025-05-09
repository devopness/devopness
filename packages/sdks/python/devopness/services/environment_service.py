"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.environments_actions_api import (
    EnvironmentsActionsApiService,
    EnvironmentsActionsApiServiceAsync,
)
from ..generated.api.environments_api import (
    EnvironmentsApiService,
    EnvironmentsApiServiceAsync,
)
from ..generated.api.projects_archived_environments_api import (
    ProjectsArchivedEnvironmentsApiService,
    ProjectsArchivedEnvironmentsApiServiceAsync,
)
from ..generated.api.projects_environments_api import (
    ProjectsEnvironmentsApiService,
    ProjectsEnvironmentsApiServiceAsync,
)

__all__ = ["EnvironmentService", "EnvironmentServiceAsync"]


class EnvironmentService(
    EnvironmentsActionsApiService,
    EnvironmentsApiService,
    ProjectsArchivedEnvironmentsApiService,
    ProjectsEnvironmentsApiService,
):
    """Service for environments in the Devopness API."""


class EnvironmentServiceAsync(
    EnvironmentsActionsApiServiceAsync,
    EnvironmentsApiServiceAsync,
    ProjectsArchivedEnvironmentsApiServiceAsync,
    ProjectsEnvironmentsApiServiceAsync,
):
    """Async service for environments in the Devopness API."""
