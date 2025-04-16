from pydantic import Field, StrictStr
from typing_extensions import Annotated
from devopness_api_client.models.step import Step
from devopness_api_client.models.step_pipeline_create import StepPipelineCreate
from devopness_api_client.models.step_pipeline_update import StepPipelineUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class PipelinesStepsApiService(ApiBaseService):
    """
    PipelinesStepsApiService - Auto Generated
    """

    async def add_pipeline_step(
        self,
        pipeline_id: int,
        step_pipeline_create: StepPipelineCreate,
    ) -> ApiResponse[Step]:
        """
        Add a step to a pipeline
        """

        endpoint: str = f"/pipelines/{pipeline_id}/steps"

        response = await self.post(endpoint, step_pipeline_create)

        return ApiResponse(response)

    async def link_step_to_pipeline(
        self,
        pipeline_id: int,
        step_id: int,
    ) -> ApiResponse:
        """
        Link a step to a Pipeline
        """

        endpoint: str = f"/pipelines/{pipeline_id}/steps/{step_id}/link"f"/pipelines/{pipeline_id}/steps/{step_id}/link"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def unlink_step_from_pipeline(
        self,
        pipeline_id: int,
        step_id: int,
    ) -> ApiResponse:
        """
        Unlink a step from a Pipeline
        """

        endpoint: str = f"/pipelines/{pipeline_id}/steps/{step_id}/unlink"f"/pipelines/{pipeline_id}/steps/{step_id}/unlink"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def update_pipeline_step(
        self,
        pipeline_id: int,
        step_id: int,
        step_pipeline_update: StepPipelineUpdate,
    ) -> ApiResponse:
        """
        Update an existing Pipeline Step
        """

        endpoint: str = f"/pipelines/{pipeline_id}/steps/{step_id}"f"/pipelines/{pipeline_id}/steps/{step_id}"

        response = await self.put(endpoint, step_pipeline_update)

        return ApiResponse(response)
