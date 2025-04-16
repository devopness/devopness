from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.team_invitation_relation import TeamInvitationRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class UsersTeamInvitationsApiService(ApiBaseService):
    """
    UsersTeamInvitationsApiService - Auto Generated
    """

    async def list_user_team_invitations(
        self,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[TeamInvitationRelation]]:
        """
        Return a list of all pending team invitations for the authenticated user
        """

        endpoint: str = "/users/team-invitations"

        response = await self.get(endpoint)

        return ApiResponse(response)
