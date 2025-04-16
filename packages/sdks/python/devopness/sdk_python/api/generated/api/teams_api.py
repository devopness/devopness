from pydantic import Field, StrictStr
from typing_extensions import Annotated
from .models.team import Team
from .models.team_update import TeamUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class TeamsApiService(ApiBaseService):
    """
    TeamsApiService - Auto Generated
    """

    async def delete_team(
        self,
        team_id: int,
    ) -> ApiResponse:
        """
        Delete a given team
        """

        endpoint: str = f"/teams/{team_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_team(
        self,
        team_id: int,
    ) -> ApiResponse[Team]:
        """
        Get a team by ID
        """

        endpoint: str = f"/teams/{team_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_team(
        self,
        team_id: int,
        team_update: TeamUpdate,
    ) -> ApiResponse:
        """
        Update an existing team
        """

        endpoint: str = f"/teams/{team_id}"

        response = await self.put(endpoint, team_update)

        return ApiResponse(response)
