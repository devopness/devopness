from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.subnet import Subnet
from devopness_api_client.models.subnet_network_create import SubnetNetworkCreate
from devopness_api_client.models.subnet_relation import SubnetRelation

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class NetworksSubnetsApiService(ApiBaseService):
    """
    NetworksSubnetsApiService - Auto Generated
    """

    async def add_network_subnet(
        self,
        network_id: int,
        subnet_network_create: SubnetNetworkCreate,
    ) -> ApiResponse[Subnet]:
        """
        Create a new subnet for the given network
        """

        endpoint: str = f"/networks/{network_id}/subnets"

        response = await self.post(endpoint, subnet_network_create)

        return ApiResponse(response)

    async def list_network_subnets(
        self,
        network_id: int,
        page: int = None,
        per_page: int = None,
        region: str = None,
        zone: str = None,
    ) -> ApiResponse[List[SubnetRelation]]:
        """
        Return a list of all subnets belonging to a network
        """

        endpoint: str = f"/networks/{network_id}/subnets"

        response = await self.get(endpoint)

        return ApiResponse(response)
