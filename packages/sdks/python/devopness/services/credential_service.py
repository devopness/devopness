"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from .._generated.api.credentials_api import CredentialsApiService
from .._generated.api.credentials_repositories_api import (
    CredentialsRepositoriesApiService,
)

__all__ = ["CredentialService"]

# pylint: disable=missing-class-docstring


class CredentialService(
    CredentialsApiService,
    CredentialsRepositoriesApiService,
):
    pass
