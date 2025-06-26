"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.pipelines_api import (
    PipelinesApiService,
    PipelinesApiServiceAsync,
)
from ..generated.api.pipelines_steps_api import (
    PipelinesStepsApiService,
    PipelinesStepsApiServiceAsync,
)

__all__ = ["PipelineService", "PipelineServiceAsync"]


class PipelineService(
    PipelinesApiService,
    PipelinesStepsApiService,
):
    """Service for pipelines in the Devopness API."""


class PipelineServiceAsync(
    PipelinesApiServiceAsync,
    PipelinesStepsApiServiceAsync,
):
    """Async service for pipelines in the Devopness API."""
