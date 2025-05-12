"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.users_api import (
    UsersApiService,
    UsersApiServiceAsync,
)
from ..generated.api.users_environments_api import (
    UsersEnvironmentsApiService,
    UsersEnvironmentsApiServiceAsync,
)
from ..generated.api.users_passwords_api import (
    UsersPasswordsApiService,
    UsersPasswordsApiServiceAsync,
)
from ..generated.api.users_projects_api import (
    UsersProjectsApiService,
    UsersProjectsApiServiceAsync,
)
from ..generated.api.users_team_invitations_api import (
    UsersTeamInvitationsApiService,
    UsersTeamInvitationsApiServiceAsync,
)

__all__ = ["UserService", "UserServiceAsync"]


class UserService(
    UsersApiService,
    UsersEnvironmentsApiService,
    UsersPasswordsApiService,
    UsersProjectsApiService,
    UsersTeamInvitationsApiService,
):
    """Service for users in the Devopness API."""


class UserServiceAsync(
    UsersApiServiceAsync,
    UsersEnvironmentsApiServiceAsync,
    UsersPasswordsApiServiceAsync,
    UsersProjectsApiServiceAsync,
    UsersTeamInvitationsApiServiceAsync,
):
    """Service for users in the Devopness API."""
