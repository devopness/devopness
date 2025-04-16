from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.request_relation import RequestRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class HooksRequestsApiService(ApiBaseService):
    """
    HooksRequestsApiService - Auto Generated
    """

    async def list_hook_requests_by_hook_type(
        self,
        hook_id: str,
        hook_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[RequestRelation]]:
        """
        Returns a list of all hook requests belonging to a hook
        """

        endpoint: str = f"/hooks/{hook_type}/{hook_id}/requests"f"/hooks/{hook_type}/{hook_id}/requests"

        response = await self.get(endpoint)

        return ApiResponse(response)
