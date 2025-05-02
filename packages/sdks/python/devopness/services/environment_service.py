"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.environments_api import EnvironmentsApiService
from ..generated.api.projects_archived_environments_api import (
    ProjectsArchivedEnvironmentsApiService,
)
from ..generated.api.projects_environments_api import ProjectsEnvironmentsApiService

__all__ = ["EnvironmentService"]

# pylint: disable=missing-class-docstring


class EnvironmentService(
    EnvironmentsApiService,
    ProjectsArchivedEnvironmentsApiService,
    ProjectsEnvironmentsApiService,
):
    pass
