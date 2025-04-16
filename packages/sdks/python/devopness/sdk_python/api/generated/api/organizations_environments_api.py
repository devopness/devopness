from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.environment_relation import EnvironmentRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class OrganizationsEnvironmentsApiService(ApiBaseService):
    """
    OrganizationsEnvironmentsApiService - Auto Generated
    """

    async def list_organization_environments(
        self,
        organization_id: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[EnvironmentRelation]]:
        """
        Return a list of all environments owned by an organization
        """

        endpoint: str = f"/organizations/{organization_id}/environments"

        response = await self.get(endpoint)

        return ApiResponse(response)
