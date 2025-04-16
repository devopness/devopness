from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.archived_environment_relation import ArchivedEnvironmentRelation

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class ProjectsArchivedEnvironmentsApiService(ApiBaseService):
    """
    ProjectsArchivedEnvironmentsApiService - Auto Generated
    """

    async def list_project_archived_environments(
        self,
        project_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ArchivedEnvironmentRelation]]:
        """
        Return a list of all archived environments belonging to a project
        """

        endpoint: str = f"/projects/{project_id}/environments/archived"

        response = await self.get(endpoint)

        return ApiResponse(response)
