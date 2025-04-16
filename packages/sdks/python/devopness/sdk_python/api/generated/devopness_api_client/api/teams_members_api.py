from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.member import Member
from devopness_api_client.models.member_relation import MemberRelation

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class TeamsMembersApiService(ApiBaseService):
    """
    TeamsMembersApiService - Auto Generated
    """

    async def delete_team_member(
        self,
        team_id: int,
        user_id: int,
    ) -> ApiResponse:
        """
        Delete a given team member
        """

        endpoint: str = f"/teams/{team_id}/members/{user_id}"f"/teams/{team_id}/members/{user_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_team_member(
        self,
        team_id: int,
        user_id: int,
    ) -> ApiResponse[Member]:
        """
        Get a member of team by ID
        """

        endpoint: str = f"/teams/{team_id}/members/{user_id}"f"/teams/{team_id}/members/{user_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_team_members(
        self,
        team_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[MemberRelation]]:
        """
        Return a list of all members belonging to a team
        """

        endpoint: str = f"/teams/{team_id}/members"

        response = await self.get(endpoint)

        return ApiResponse(response)
