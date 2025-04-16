from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.hook import Hook
from devopness_api_client.models.hook_pipeline_create import HookPipelineCreate
from devopness_api_client.models.hook_relation import HookRelation

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class PipelinesHooksApiService(ApiBaseService):
    """
    PipelinesHooksApiService - Auto Generated
    """

    async def add_pipeline_hook(
        self,
        hook_type: str,
        pipeline_id: int,
        hook_pipeline_create: HookPipelineCreate,
    ) -> ApiResponse[Hook]:
        """
        Create a hook to a specific pipeline
        """

        endpoint: str = f"/pipelines/{pipeline_id}/hooks/{hook_type}"f"/pipelines/{pipeline_id}/hooks/{hook_type}"

        response = await self.post(endpoint, hook_pipeline_create)

        return ApiResponse(response)

    async def list_pipeline_hooks(
        self,
        pipeline_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[HookRelation]]:
        """
        List all hooks in a pipeline
        """

        endpoint: str = f"/pipelines/{pipeline_id}/hooks"

        response = await self.get(endpoint)

        return ApiResponse(response)
