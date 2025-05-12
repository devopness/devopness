"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.projects_actions_api import (
    ProjectsActionsApiService,
    ProjectsActionsApiServiceAsync,
)
from ..generated.api.projects_api import (
    ProjectsApiService,
    ProjectsApiServiceAsync,
)

__all__ = ["ProjectService", "ProjectServiceAsync"]


class ProjectService(
    ProjectsApiService,
    ProjectsActionsApiService,
):
    """Service for projects in the Devopness API."""


class ProjectServiceAsync(
    ProjectsApiServiceAsync,
    ProjectsActionsApiServiceAsync,
):
    """Async service for projects in the Devopness API."""
