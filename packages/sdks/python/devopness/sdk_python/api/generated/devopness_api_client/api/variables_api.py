from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.variable import Variable
from devopness_api_client.models.variable_create import VariableCreate
from devopness_api_client.models.variable_relation import VariableRelation
from devopness_api_client.models.variable_update import VariableUpdate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class VariablesApiService(ApiBaseService):
    """
    VariablesApiService - Auto Generated
    """

    async def add_variable(
        self,
        resource_id: int,
        resource_type: str,
        variable_create: VariableCreate,
    ) -> ApiResponse[Variable]:
        """
        Create a new variable linked to a resource
        """

        endpoint: str = f"/variables/{resource_type}/{resource_id}"f"/variables/{resource_type}/{resource_id}"

        response = await self.post(endpoint, variable_create)

        return ApiResponse(response)

    async def delete_variable(
        self,
        variable_id: int,
    ) -> ApiResponse:
        """
        Delete a variable by ID
        """

        endpoint: str = f"/variables/{variable_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_variable(
        self,
        variable_id: int,
    ) -> ApiResponse[Variable]:
        """
        Get a variable by ID
        """

        endpoint: str = f"/variables/{variable_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_variables_by_resource_type(
        self,
        resource_id: int,
        resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[VariableRelation]]:
        """
        Return a list of variables belonging to a resource
        """

        endpoint: str = f"/variables/{resource_type}/{resource_id}"f"/variables/{resource_type}/{resource_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_variable(
        self,
        variable_id: int,
        variable_update: VariableUpdate,
    ) -> ApiResponse:
        """
        Update an existing variable
        """

        endpoint: str = f"/variables/{variable_id}"

        response = await self.put(endpoint, variable_update)

        return ApiResponse(response)
