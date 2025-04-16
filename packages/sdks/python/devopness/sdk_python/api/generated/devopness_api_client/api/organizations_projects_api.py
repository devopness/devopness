from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.project_relation import ProjectRelation

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class OrganizationsProjectsApiService(ApiBaseService):
    """
    OrganizationsProjectsApiService - Auto Generated
    """

    async def list_organization_projects(
        self,
        organization_id: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ProjectRelation]]:
        """
        Return a list of all projects owned by an organization
        """

        endpoint: str = f"/organizations/{organization_id}/projects"

        response = await self.get(endpoint)

        return ApiResponse(response)
