from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.variable import Variable
from devopness_api_client.models.variable_relation import VariableRelation
from devopness_api_client.models.variable_service_create import VariableServiceCreate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class ServicesVariablesApiService(ApiBaseService):
    """
    ServicesVariablesApiService - Auto Generated
    """

    async def add_service_variable(
        self,
        service_id: int,
        variable_service_create: VariableServiceCreate,
    ) -> ApiResponse[Variable]:
        """
        Create a new variable linked to a service
        """

        endpoint: str = f"/services/{service_id}/variables"

        response = await self.post(endpoint, variable_service_create)

        return ApiResponse(response)

    async def list_service_variables(
        self,
        service_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[VariableRelation]]:
        """
        Return a list of variables belonging to a service
        """

        endpoint: str = f"/services/{service_id}/variables"

        response = await self.get(endpoint)

        return ApiResponse(response)
