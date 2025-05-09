"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.pipelines_actions_api import (
    PipelinesActionsApiService,
    PipelinesActionsApiServiceAsync,
)
from ..generated.api.pipelines_api import (
    PipelinesApiService,
    PipelinesApiServiceAsync,
)
from ..generated.api.pipelines_hooks_api import (
    PipelinesHooksApiService,
    PipelinesHooksApiServiceAsync,
)
from ..generated.api.pipelines_steps_api import (
    PipelinesStepsApiService,
    PipelinesStepsApiServiceAsync,
)

__all__ = ["PipelineService", "PipelineServiceAsync"]


class PipelineService(
    PipelinesApiService,
    PipelinesActionsApiService,
    PipelinesHooksApiService,
    PipelinesStepsApiService,
):
    """Service for pipelines in the Devopness API."""


class PipelineServiceAsync(
    PipelinesApiServiceAsync,
    PipelinesActionsApiServiceAsync,
    PipelinesHooksApiServiceAsync,
    PipelinesStepsApiServiceAsync,
):
    """Async service for pipelines in the Devopness API."""
