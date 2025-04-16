from pydantic import Field, StrictStr
from typing_extensions import Annotated
from devopness_api_client.models.environment import Environment
from devopness_api_client.models.environment_update import EnvironmentUpdate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class EnvironmentsApiService(ApiBaseService):
    """
    EnvironmentsApiService - Auto Generated
    """

    async def archive_environment(
        self,
        environment_id: int,
    ) -> ApiResponse:
        """
        Archive an environment
        """

        endpoint: str = f"/environments/{environment_id}/archive"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def get_environment(
        self,
        environment_id: int,
    ) -> ApiResponse[Environment]:
        """
        Get an environment by ID
        """

        endpoint: str = f"/environments/{environment_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def unarchive_environment(
        self,
        environment_id: int,
    ) -> ApiResponse:
        """
        Unarchive an environment
        """

        endpoint: str = f"/environments/{environment_id}/unarchive"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def update_environment(
        self,
        environment_id: int,
        environment_update: EnvironmentUpdate,
    ) -> ApiResponse:
        """
        Update a given environment
        """

        endpoint: str = f"/environments/{environment_id}"

        response = await self.put(endpoint, environment_update)

        return ApiResponse(response)
