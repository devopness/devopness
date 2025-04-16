from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.variable import Variable
from .models.variable_relation import VariableRelation
from .models.variable_service_create import VariableServiceCreate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


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
