"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.ssh_keys_api import (
    SSHKeysApiService,
    SSHKeysApiServiceAsync,
)

__all__ = ["SSHKeyService", "SSHKeyServiceAsync"]


class SSHKeyService(
    SSHKeysApiService,
):
    """Service for ssh keys in the Devopness API."""


class SSHKeyServiceAsync(
    SSHKeysApiServiceAsync,
):
    """Async service for ssh keys in the Devopness API."""
