from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.variable import Variable
from .models.variable_application_create import VariableApplicationCreate
from .models.variable_relation import VariableRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ApplicationsVariablesApiService(ApiBaseService):
    """
    ApplicationsVariablesApiService - Auto Generated
    """

    async def add_application_variable(
        self,
        application_id: int,
        variable_application_create: VariableApplicationCreate,
    ) -> ApiResponse[Variable]:
        """
        Create a new variable linked to an application
        """

        endpoint: str = f"/applications/{application_id}/variables"

        response = await self.post(endpoint, variable_application_create)

        return ApiResponse(response)

    async def list_application_variables(
        self,
        application_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[VariableRelation]]:
        """
        Return a list of variables belonging to an application
        """

        endpoint: str = f"/applications/{application_id}/variables"

        response = await self.get(endpoint)

        return ApiResponse(response)
