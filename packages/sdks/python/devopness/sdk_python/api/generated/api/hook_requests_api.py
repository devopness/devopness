from pydantic import Field, StrictStr
from typing_extensions import Annotated
from .models.hook_request import HookRequest

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class HookRequestsApiService(ApiBaseService):
    """
    HookRequestsApiService - Auto Generated
    """

    async def get_hook_request(
        self,
        hook_request_id: str,
    ) -> ApiResponse[HookRequest]:
        """
        Get a hook request by ID
        """

        endpoint: str = f"/hook-requests/{hook_request_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)
