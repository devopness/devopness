"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.projects_api_tokens_api import (
    ProjectsAPITokensApiService,
    ProjectsAPITokensApiServiceAsync,
)
from ..generated.api.users_personal_access_tokens_api import (
    UsersPersonalAccessTokensApiService,
    UsersPersonalAccessTokensApiServiceAsync,
)

__all__ = ["APITokenService", "APITokenServiceAsync"]


class APITokenService(
    ProjectsAPITokensApiService,
    UsersPersonalAccessTokensApiService,
):
    """Service for API Tokens in the Devopness API."""


class APITokenServiceAsync(
    ProjectsAPITokensApiServiceAsync,
    UsersPersonalAccessTokensApiServiceAsync,
):
    """Async service for API Tokens in the Devopness API."""
