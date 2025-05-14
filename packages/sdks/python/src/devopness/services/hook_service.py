"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.applications_hooks_api import (
    ApplicationsHooksApiService,
    ApplicationsHooksApiServiceAsync,
)
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
from ..generated.api.pipelines_hooks_api import (
    PipelinesHooksApiService,
    PipelinesHooksApiServiceAsync,
)

__all__ = ["HookService", "HookServiceAsync"]


class HookService(
    HooksApiService,
    HookRequestsApiService,
    HooksRequestsApiService,
    ApplicationsHooksApiService,
    PipelinesHooksApiService,
):
    """Service for hooks in the Devopness API."""


class HookServiceAsync(
    HooksApiServiceAsync,
    HookRequestsApiServiceAsync,
    HooksRequestsApiServiceAsync,
    ApplicationsHooksApiServiceAsync,
    PipelinesHooksApiServiceAsync,
):
    """Async service for hooks in the Devopness API."""
