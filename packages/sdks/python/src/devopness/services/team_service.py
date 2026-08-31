"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..base import DevopnessClientState
from ..generated.api.team_invitations_api import (
    TeamInvitationsApiService,
    TeamInvitationsApiServiceAsync,
)
from ..generated.api.teams_api import (
    TeamsApiService,
    TeamsApiServiceAsync,
)
from ..generated.api.teams_invitations_api import (
    TeamsInvitationsApiService,
    TeamsInvitationsApiServiceAsync,
)
from ..generated.api.teams_members_api import (
    TeamsMembersApiService,
    TeamsMembersApiServiceAsync,
)
from ..generated.api.users_team_invitations_api import (
    UsersTeamInvitationsApiService,
    UsersTeamInvitationsApiServiceAsync,
)

__all__ = ["TeamService", "TeamServiceAsync"]


class TeamInvitationService(
    TeamInvitationsApiService,
    TeamsInvitationsApiService,
    UsersTeamInvitationsApiService,
):
    """Service for team invitations in the Devopness API."""


class TeamInvitationServiceAsync(
    TeamInvitationsApiServiceAsync,
    TeamsInvitationsApiServiceAsync,
    UsersTeamInvitationsApiServiceAsync,
):
    """Async service for team invitations in the Devopness API."""


class TeamService(
    TeamsApiService,
):
    """Service for teams in the Devopness API."""

    invitations: TeamInvitationService
    members: TeamsMembersApiService

    def __init__(self, state: DevopnessClientState | None = None) -> None:
        """
        Bind the team service and its nested services to one client state.
        """
        super().__init__(state)

        self.invitations = TeamInvitationService(self._state)
        self.members = TeamsMembersApiService(self._state)


class TeamServiceAsync(
    TeamsApiServiceAsync,
):
    """Async service for teams in the Devopness API."""

    invitations: TeamInvitationServiceAsync
    members: TeamsMembersApiServiceAsync

    def __init__(self, state: DevopnessClientState | None = None) -> None:
        """
        Bind the async team service and its nested services to one client state.
        """
        super().__init__(state)

        self.invitations = TeamInvitationServiceAsync(self._state)
        self.members = TeamsMembersApiServiceAsync(self._state)
