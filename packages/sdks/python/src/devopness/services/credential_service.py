"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.credentials_api import (
    CredentialsApiService,
    CredentialsApiServiceAsync,
)
from ..generated.api.credentials_repositories_api import (
    CredentialsRepositoriesApiService,
    CredentialsRepositoriesApiServiceAsync,
)

__all__ = ["CredentialService", "CredentialServiceAsync"]


class CredentialService(
    CredentialsApiService,
    CredentialsRepositoriesApiService,
):
    """Service for credentials in the Devopness API."""


class CredentialServiceAsync(
    CredentialsApiServiceAsync,
    CredentialsRepositoriesApiServiceAsync,
):
    """Async service for credentials in the Devopness API."""
