"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.projects_api import (
    ProjectsApiService,
    ProjectsApiServiceAsync,
)

__all__ = ["ProjectService", "ProjectServiceAsync"]


class ProjectService(
    ProjectsApiService,
):
    """Service for projects in the Devopness API."""


class ProjectServiceAsync(
    ProjectsApiServiceAsync,
):
    """Async service for projects in the Devopness API."""
