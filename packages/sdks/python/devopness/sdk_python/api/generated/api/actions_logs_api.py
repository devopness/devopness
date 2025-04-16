from pydantic import Field, StrictStr
from typing_extensions import Annotated
from .models.log import Log

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ActionsLogsApiService(ApiBaseService):
    """
    ActionsLogsApiService - Auto Generated
    """

    async def get_action_log(
        self,
        action_id: int,
        action_step_order: int,
        action_target_id: int,
    ) -> ApiResponse[Log]:
        """
        Get action target step log
        """

        endpoint: str = f"/actions/{action_id}/targets/{action_target_id}/steps/{action_step_order}/logs"f"/actions/{action_id}/targets/{action_target_id}/steps/{action_step_order}/logs"f"/actions/{action_id}/targets/{action_target_id}/steps/{action_step_order}/logs"

        response = await self.get(endpoint)

        return ApiResponse(response)
