"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from dataclasses import dataclass
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .client_config import DevopnessClientConfig

DEVOPNESS_CLIENT_STATE_EXTENSION_KEY = "devopness_client_state"


@dataclass
class DevopnessClientState:
    """
    Per-client runtime state for Devopness SDK instances.

    This groups the immutable client configuration with mutable runtime data
    such as access tokens and token expiration timestamps.
    """

    config: "DevopnessClientConfig"
    access_token: str | None = None
    refresh_token: str | None = None
    token_expires_at: datetime | None = None
