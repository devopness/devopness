from pydantic import Field, StrictStr
from typing_extensions import Annotated

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class TeamInvitationsApiService(ApiBaseService):
    """
    TeamInvitationsApiService - Auto Generated
    """

    async def accept_team_invitation(
        self,
        team_invitation_id: str,
    ) -> ApiResponse:
        """
        Accept a pending team invitation
        """

        endpoint: str = f"/team-invitations/{team_invitation_id}/accept"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def delete_team_invitation(
        self,
        team_invitation_id: str,
    ) -> ApiResponse:
        """
        Delete a pending team invitation
        """

        endpoint: str = f"/team-invitations/{team_invitation_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def reject_team_invitation(
        self,
        team_invitation_id: str,
    ) -> ApiResponse:
        """
        Reject a pending team invitation
        """

        endpoint: str = f"/team-invitations/{team_invitation_id}/reject"

        response = await self.post(endpoint)

        return ApiResponse(response)
