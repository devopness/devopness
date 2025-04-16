from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.team import Team
from .models.team_project_create import TeamProjectCreate
from .models.team_relation import TeamRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


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
