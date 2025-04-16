from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.team import Team
from devopness_api_client.models.team_project_create import TeamProjectCreate
from devopness_api_client.models.team_relation import TeamRelation

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class ProjectsTeamsApiService(ApiBaseService):
    """
    ProjectsTeamsApiService - Auto Generated
    """

    async def add_project_team(
        self,
        project_id: int,
        team_project_create: TeamProjectCreate,
    ) -> ApiResponse[Team]:
        """
        Create a team to the given project
        """

        endpoint: str = f"/projects/{project_id}/teams"

        response = await self.post(endpoint, team_project_create)

        return ApiResponse(response)

    async def list_project_teams(
        self,
        project_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[TeamRelation]]:
        """
        Return a list of all teams belonging to a project
        """

        endpoint: str = f"/projects/{project_id}/teams"

        response = await self.get(endpoint)

        return ApiResponse(response)
