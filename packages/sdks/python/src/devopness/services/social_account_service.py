"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.social_accounts_api import (
    SocialAccountsApiService,
    SocialAccountsApiServiceAsync,
)

__all__ = ["SocialAccountService", "SocialAccountServiceAsync"]


class SocialAccountService(
    SocialAccountsApiService,
):
    """Service for social accounts in the Devopness API."""


class SocialAccountServiceAsync(
    SocialAccountsApiServiceAsync,
):
    """Async service for social accounts in the Devopness API."""
