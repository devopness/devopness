"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.projects_api_tokens_api import (
    ProjectsApiTokensApiService,
    ProjectsApiTokensApiServiceAsync,
)
from ..generated.api.users_personal_access_tokens_api import (
    UsersPersonalAccessTokensApiService,
    UsersPersonalAccessTokensApiServiceAsync,
)

__all__ = ["APITokenService", "APITokenServiceAsync"]


class APITokenService(
    ProjectsApiTokensApiService,
    UsersPersonalAccessTokensApiService,
):
    """Service for API Tokens in the Devopness API."""


class APITokenServiceAsync(
    ProjectsApiTokensApiServiceAsync,
    UsersPersonalAccessTokensApiServiceAsync,
):
    """Async service for API Tokens in the Devopness API."""
