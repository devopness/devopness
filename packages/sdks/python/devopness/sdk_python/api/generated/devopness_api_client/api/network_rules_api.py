from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.network_rule import NetworkRule
from devopness_api_client.models.network_rule_environment_create import NetworkRuleEnvironmentCreate
from devopness_api_client.models.network_rule_relation import NetworkRuleRelation
from devopness_api_client.models.network_rule_update import NetworkRuleUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class NetworkRulesApiService(ApiBaseService):
    """
    NetworkRulesApiService - Auto Generated
    """

    async def add_environment_network_rule(
        self,
        environment_id: int,
        network_rule_environment_create: NetworkRuleEnvironmentCreate,
    ) -> ApiResponse[NetworkRule]:
        """
        Add a Network Rule to the given environment
        """

        endpoint: str = f"/environments/{environment_id}/network-rules"

        response = await self.post(endpoint, network_rule_environment_create)

        return ApiResponse(response)

    async def delete_network_rule(
        self,
        network_rule_id: int,
    ) -> ApiResponse:
        """
        Delete a given Network Rule
        """

        endpoint: str = f"/network-rules/{network_rule_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_network_rule(
        self,
        network_rule_id: int,
    ) -> ApiResponse[NetworkRule]:
        """
        Get a Network Rule by ID
        """

        endpoint: str = f"/network-rules/{network_rule_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_environment_network_rules(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[NetworkRuleRelation]]:
        """
        Return a list of all Network Rules belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/network-rules"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_network_rule(
        self,
        network_rule_id: int,
        network_rule_update: NetworkRuleUpdate,
    ) -> ApiResponse:
        """
        Update an existing Network Rule
        """

        endpoint: str = f"/network-rules/{network_rule_id}"

        response = await self.put(endpoint, network_rule_update)

        return ApiResponse(response)
