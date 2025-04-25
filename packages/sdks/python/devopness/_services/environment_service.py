"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from .._generated.api.environments_api import EnvironmentsApiService
from .._generated.api.projects_archived_environments_api import (
    ProjectsArchivedEnvironmentsApiService,
)
from .._generated.api.projects_environments_api import ProjectsEnvironmentsApiService

__all__ = ["EnvironmentService"]

# pylint: disable=missing-class-docstring


class EnvironmentService(
    EnvironmentsApiService,
    ProjectsArchivedEnvironmentsApiService,
    ProjectsEnvironmentsApiService,
):
    pass
