from pydantic import Field, StrictStr
from typing_extensions import Annotated
from devopness_api_client.models.subnet import Subnet

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class SubnetsApiService(ApiBaseService):
    """
    SubnetsApiService - Auto Generated
    """

    async def delete_subnet(
        self,
        subnet_id: int,
    ) -> ApiResponse:
        """
        Delete a given subnet
        """

        endpoint: str = f"/subnets/{subnet_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_subnet(
        self,
        subnet_id: int,
    ) -> ApiResponse[Subnet]:
        """
        Get a subnet by ID
        """

        endpoint: str = f"/subnets/{subnet_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)
