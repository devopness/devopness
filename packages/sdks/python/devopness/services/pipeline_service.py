"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.pipelines_actions_api import PipelinesActionsApiService
from ..generated.api.pipelines_api import PipelinesApiService
from ..generated.api.pipelines_hooks_api import PipelinesHooksApiService
from ..generated.api.pipelines_steps_api import PipelinesStepsApiService

__all__ = ["PipelineService"]

# pylint: disable=missing-class-docstring


class PipelineService(
    PipelinesApiService,
    PipelinesActionsApiService,
    PipelinesHooksApiService,
    PipelinesStepsApiService,
):
    pass
