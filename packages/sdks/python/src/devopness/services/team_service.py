"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.environments_team_memberships_api import (
    EnvironmentsTeamMembershipsApiService,
    EnvironmentsTeamMembershipsApiServiceAsync,
)
from ..generated.api.environments_teams_api import (
    EnvironmentsTeamsApiService,
    EnvironmentsTeamsApiServiceAsync,
)
from ..generated.api.projects_teams_api import (
    ProjectsTeamsApiService,
    ProjectsTeamsApiServiceAsync,
)
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
    EnvironmentsTeamsApiService,
    EnvironmentsTeamMembershipsApiService,
    ProjectsTeamsApiService,
):
    """Service for teams in the Devopness API."""

    invitations: TeamInvitationService
    members: TeamsMembersApiService

    def __init__(self) -> None:
        super().__init__()

        self.invitations = TeamInvitationService()
        self.members = TeamsMembersApiService()


class TeamServiceAsync(
    TeamsApiServiceAsync,
    EnvironmentsTeamsApiServiceAsync,
    EnvironmentsTeamMembershipsApiServiceAsync,
    ProjectsTeamsApiServiceAsync,
):
    """Async service for teams in the Devopness API."""

    invitations: TeamInvitationServiceAsync
    members: TeamsMembersApiServiceAsync

    def __init__(self) -> None:
        super().__init__()

        self.invitations = TeamInvitationServiceAsync()
        self.members = TeamsMembersApiServiceAsync()
