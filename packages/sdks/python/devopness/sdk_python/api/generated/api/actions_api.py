from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.action import Action
from .models.action_relation import ActionRelation
from .models.action_retry_response import ActionRetryResponse

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ActionsApiService(ApiBaseService):
    """
    ActionsApiService - Auto Generated
    """

    async def get_action(
        self,
        action_id: int,
    ) -> ApiResponse[Action]:
        """
        Get an action by ID
        """

        endpoint: str = f"/actions/{action_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_actions(
        self,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ActionRelation]]:
        """
        Return a list of all actions belonging to current user
        """

        endpoint: str = "/actions"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_actions_by_resource_type(
        self,
        resource_id: int,
        resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ActionRelation]]:
        """
        List resource actions of an action type
        """

        endpoint: str = f"/actions/{resource_type}/{resource_id}"f"/actions/{resource_type}/{resource_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_actions_by_target_resource_type(
        self,
        target_resource_id: int,
        target_resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ActionRelation]]:
        """
        List actions triggered to a given action target resource
        """

        endpoint: str = f"/actions/targets/{target_resource_type}/{target_resource_id}"f"/actions/targets/{target_resource_type}/{target_resource_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def retry_action(
        self,
        action_id: int,
    ) -> ApiResponse[ActionRetryResponse]:
        """
        Retry an action
        """

        endpoint: str = f"/actions/{action_id}/retry"

        response = await self.post(endpoint)

        return ApiResponse(response)
