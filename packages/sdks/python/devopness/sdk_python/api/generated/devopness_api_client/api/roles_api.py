from pydantic import Field, StrictStr
from typing_extensions import Annotated
from devopness_api_client.models.role import Role
from devopness_api_client.models.role_update import RoleUpdate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class RolesApiService(ApiBaseService):
    """
    RolesApiService - Auto Generated
    """

    async def delete_role(
        self,
        role_id: int,
    ) -> ApiResponse:
        """
        Delete a given role
        """

        endpoint: str = f"/roles/{role_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_role(
        self,
        role_id: int,
    ) -> ApiResponse[Role]:
        """
        Get a role by ID
        """

        endpoint: str = f"/roles/{role_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_role(
        self,
        role_id: int,
        role_update: RoleUpdate,
    ) -> ApiResponse:
        """
        Update an existing role
        """

        endpoint: str = f"/roles/{role_id}"

        response = await self.put(endpoint, role_update)

        return ApiResponse(response)
