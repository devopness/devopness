from pydantic import Field, StrictStr
from typing_extensions import Annotated
from .models.hook import Hook
from .models.hook_trigger_response import HookTriggerResponse
from .models.hook_update import HookUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class HooksApiService(ApiBaseService):
    """
    HooksApiService - Auto Generated
    """

    async def delete_hook(
        self,
        hook_id: str,
        hook_type: str,
    ) -> ApiResponse:
        """
        Delete a given hook
        """

        endpoint: str = f"/hooks/{hook_type}/{hook_id}"f"/hooks/{hook_type}/{hook_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_hook(
        self,
        hook_id: str,
        hook_type: str,
    ) -> ApiResponse[Hook]:
        """
        Get a hook by ID
        """

        endpoint: str = f"/hooks/{hook_type}/{hook_id}"f"/hooks/{hook_type}/{hook_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def trigger_hook(
        self,
        hook_id: str,
    ) -> ApiResponse[HookTriggerResponse]:
        """
        Trigger an incoming hook associated action
        """

        endpoint: str = f"/hooks/{hook_id}/trigger"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def update_hook(
        self,
        hook_id: str,
        hook_type: str,
        hook_update: HookUpdate,
    ) -> ApiResponse:
        """
        Update an existing hook
        """

        endpoint: str = f"/hooks/{hook_type}/{hook_id}"f"/hooks/{hook_type}/{hook_id}"

        response = await self.put(endpoint, hook_update)

        return ApiResponse(response)
