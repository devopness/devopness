"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.users_api import (
    UsersApiService,
    UsersApiServiceAsync,
)
from ..generated.api.users_passwords_api import (
    UsersPasswordsApiService,
    UsersPasswordsApiServiceAsync,
)

__all__ = ["UserService", "UserServiceAsync"]


class UserService(
    UsersApiService,
    UsersPasswordsApiService,
):
    """Service for users in the Devopness API."""


class UserServiceAsync(
    UsersApiServiceAsync,
    UsersPasswordsApiServiceAsync,
):
    """Service for users in the Devopness API."""
