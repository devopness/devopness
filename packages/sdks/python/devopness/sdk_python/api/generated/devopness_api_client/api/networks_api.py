from pydantic import Field, StrictBool, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.network import Network
from devopness_api_client.models.network_environment_create import NetworkEnvironmentCreate
from devopness_api_client.models.network_relation import NetworkRelation
from devopness_api_client.models.network_update import NetworkUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class NetworksApiService(ApiBaseService):
    """
    NetworksApiService - Auto Generated
    """

    async def add_environment_network(
        self,
        environment_id: int,
        network_environment_create: NetworkEnvironmentCreate,
    ) -> ApiResponse[Network]:
        """
        Create a new network for the given environment
        """

        endpoint: str = f"/environments/{environment_id}/networks"

        response = await self.post(endpoint, network_environment_create)

        return ApiResponse(response)

    async def delete_network(
        self,
        network_id: int,
    ) -> ApiResponse:
        """
        Delete a given network
        """

        endpoint: str = f"/networks/{network_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_network(
        self,
        network_id: int,
    ) -> ApiResponse[Network]:
        """
        Get a network by ID
        """

        endpoint: str = f"/networks/{network_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_status_network(
        self,
        network_id: int,
    ) -> ApiResponse:
        """
        Get current status of a network
        """

        endpoint: str = f"/networks/{network_id}/get-status"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def list_environment_networks(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
        include_default_network: bool = None,
        provider_name: str = None,
        region: str = None,
    ) -> ApiResponse[List[NetworkRelation]]:
        """
        Return a list of all networks belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/networks"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_network(
        self,
        network_id: int,
        network_update: NetworkUpdate,
    ) -> ApiResponse:
        """
        Update an existing Network
        """

        endpoint: str = f"/networks/{network_id}"

        response = await self.put(endpoint, network_update)

        return ApiResponse(response)
