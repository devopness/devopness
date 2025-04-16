from pydantic import Field, StrictInt, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.environment_relation import EnvironmentRelation

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class UsersEnvironmentsApiService(ApiBaseService):
    """
    UsersEnvironmentsApiService - Auto Generated
    """

    async def list_user_environments(
        self,
        user_id: str,
        page: int = None,
        per_page: int = None,
        subscription_id: int = None,
    ) -> ApiResponse[List[EnvironmentRelation]]:
        """
        Return a list of all environments owned by a user
        """

        endpoint: str = f"/users/{user_id}/environments"

        response = await self.get(endpoint)

        return ApiResponse(response)
