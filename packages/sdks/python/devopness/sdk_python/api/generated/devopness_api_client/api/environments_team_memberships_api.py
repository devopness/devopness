from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.team_membership_relation import TeamMembershipRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class EnvironmentsTeamMembershipsApiService(ApiBaseService):
    """
    EnvironmentsTeamMembershipsApiService - Auto Generated
    """

    async def list_environment_team_memberships(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[TeamMembershipRelation]]:
        """
        Return a list of teams with access to an environment
        """

        endpoint: str = f"/environments/{environment_id}/team-memberships"

        response = await self.get(endpoint)

        return ApiResponse(response)
