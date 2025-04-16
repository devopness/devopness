from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.action import Action
from devopness_api_client.models.action_pipeline_create import ActionPipelineCreate
from devopness_api_client.models.action_relation import ActionRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class PipelinesActionsApiService(ApiBaseService):
    """
    PipelinesActionsApiService - Auto Generated
    """

    async def add_pipeline_action(
        self,
        pipeline_id: int,
        action_pipeline_create: ActionPipelineCreate,
    ) -> ApiResponse[Action]:
        """
        Create an action to run a Pipeline
        """

        endpoint: str = f"/pipelines/{pipeline_id}/actions"

        response = await self.post(endpoint, action_pipeline_create)

        return ApiResponse(response)

    async def list_pipeline_actions(
        self,
        pipeline_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ActionRelation]]:
        """
        Return a list of pipeline's actions
        """

        endpoint: str = f"/pipelines/{pipeline_id}/actions"

        response = await self.get(endpoint)

        return ApiResponse(response)
