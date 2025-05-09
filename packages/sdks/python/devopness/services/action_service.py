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

__all__ = ["ActionService", "ActionServiceAsync"]


class ActionService(
    ActionsApiService,
    ActionsLogsApiService,
):
    """Service for actions in the Devopness API."""


class ActionServiceAsync(
    ActionsApiServiceAsync,
    ActionsLogsApiServiceAsync,
):
    """Async service for actions in the Devopness API."""
