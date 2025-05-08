"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.actions_api import ActionsApiService
from ..generated.api.actions_logs_api import ActionsLogsApiService

__all__ = ["ActionService"]

# pylint: disable=missing-class-docstring


class ActionService(
    ActionsApiService,
    ActionsLogsApiService,
):
    pass
