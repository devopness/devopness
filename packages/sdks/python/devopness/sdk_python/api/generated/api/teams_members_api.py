from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.member import Member
from .models.member_relation import MemberRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


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
