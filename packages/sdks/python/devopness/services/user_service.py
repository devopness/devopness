"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.users_api import (
    UsersApiService,
    UsersApiServiceAsync,
)

__all__ = ["UserService", "UserServiceAsync"]


class UserService(
    UsersApiService,
):
    """Service for users in the Devopness API."""


class UserServiceAsync(
    UsersApiServiceAsync,
):
    """Service for users in the Devopness API."""
