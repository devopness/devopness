"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.hook_requests_api import (
    HookRequestsApiService,
    HookRequestsApiServiceAsync,
)
from ..generated.api.hooks_api import (
    HooksApiService,
    HooksApiServiceAsync,
)
from ..generated.api.hooks_requests_api import (
    HooksRequestsApiService,
    HooksRequestsApiServiceAsync,
)

__all__ = ["HookService", "HookServiceAsync"]


class HookService(
    HooksApiService,
    HookRequestsApiService,
    HooksRequestsApiService,
):
    """Service for hooks in the Devopness API."""


class HookServiceAsync(
    HooksApiServiceAsync,
    HookRequestsApiServiceAsync,
    HooksRequestsApiServiceAsync,
):
    """Async service for hooks in the Devopness API."""
