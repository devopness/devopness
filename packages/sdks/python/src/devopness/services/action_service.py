"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.actions_api import (
    ActionsApiService,
    ActionsApiServiceAsync,
)
from ..generated.api.actions_logs_api import (
    ActionsLogsApiService,
    ActionsLogsApiServiceAsync,
)
from ..generated.api.environments_actions_api import (
    EnvironmentsActionsApiService,
    EnvironmentsActionsApiServiceAsync,
)
from ..generated.api.pipelines_actions_api import (
    PipelinesActionsApiService,
    PipelinesActionsApiServiceAsync,
)
from ..generated.api.projects_actions_api import (
    ProjectsActionsApiService,
    ProjectsActionsApiServiceAsync,
)

__all__ = ["ActionService", "ActionServiceAsync"]


class ActionService(
    ActionsApiService,
    ActionsLogsApiService,
    EnvironmentsActionsApiService,
    PipelinesActionsApiService,
    ProjectsActionsApiService,
):
    """Service for actions in the Devopness API."""


class ActionServiceAsync(
    ActionsApiServiceAsync,
    ActionsLogsApiServiceAsync,
    EnvironmentsActionsApiServiceAsync,
    PipelinesActionsApiServiceAsync,
    ProjectsActionsApiServiceAsync,
):
    """Async service for actions in the Devopness API."""
