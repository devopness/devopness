from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.action_relation import ActionRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class EnvironmentsActionsApiService(ApiBaseService):
    """
    EnvironmentsActionsApiService - Auto Generated
    """

    async def list_environment_actions(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ActionRelation]]:
        """
        List environment actions
        """

        endpoint: str = f"/environments/{environment_id}/actions"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_environment_actions_by_resource_type(
        self,
        environment_id: int,
        resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ActionRelation]]:
        """
        List environment actions of a resource type
        """

        endpoint: str = f"/environments/{environment_id}/actions/{resource_type}"f"/environments/{environment_id}/actions/{resource_type}"

        response = await self.get(endpoint)

        return ApiResponse(response)
