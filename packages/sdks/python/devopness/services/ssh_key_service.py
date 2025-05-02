"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.ssh_keys_api import SSHKeysApiService

__all__ = ["SSHKeyService"]

# pylint: disable=missing-class-docstring


class SSHKeyService(
    SSHKeysApiService,
):
    """Service for ssh keys in the Devopness API."""
