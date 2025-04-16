from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.invitation import Invitation
from devopness_api_client.models.invitation_relation import InvitationRelation
from devopness_api_client.models.invitation_team_create import InvitationTeamCreate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class TeamsInvitationsApiService(ApiBaseService):
    """
    TeamsInvitationsApiService - Auto Generated
    """

    async def add_team_invitation(
        self,
        team_id: int,
        invitation_team_create: InvitationTeamCreate,
    ) -> ApiResponse[Invitation]:
        """
        Send invitation to user email to participate to a team
        """

        endpoint: str = f"/teams/{team_id}/invitations"

        response = await self.post(endpoint, invitation_team_create)

        return ApiResponse(response)

    async def list_team_invitations(
        self,
        team_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[InvitationRelation]]:
        """
        Return a list of pending invitations belonging to a team
        """

        endpoint: str = f"/teams/{team_id}/invitations"

        response = await self.get(endpoint)

        return ApiResponse(response)
