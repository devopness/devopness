from pydantic import Field, StrictStr
from typing_extensions import Annotated
from devopness_api_client.models.team_environment_link import TeamEnvironmentLink

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class EnvironmentsTeamsApiService(ApiBaseService):
    """
    EnvironmentsTeamsApiService - Auto Generated
    """

    async def link_team_to_environment(
        self,
        environment_id: int,
        team_id: int,
        team_environment_link: TeamEnvironmentLink,
    ) -> ApiResponse:
        """
        Link team to a given environment
        """

        endpoint: str = f"/environments/{environment_id}/teams/{team_id}/link"f"/environments/{environment_id}/teams/{team_id}/link"

        response = await self.post(endpoint, team_environment_link)

        return ApiResponse(response)

    async def unlink_team_from_environment(
        self,
        environment_id: int,
        team_id: int,
    ) -> ApiResponse:
        """
        Unlink team from the environment
        """

        endpoint: str = f"/environments/{environment_id}/teams/{team_id}/unlink"f"/environments/{environment_id}/teams/{team_id}/unlink"

        response = await self.delete(endpoint)

        return ApiResponse(response)
