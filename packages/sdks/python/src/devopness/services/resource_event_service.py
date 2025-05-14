"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.resource_events_api import (
    ResourceEventsApiService,
    ResourceEventsApiServiceAsync,
)

__all__ = ["ResourceEventService", "ResourceEventServiceAsync"]


class ResourceEventService(
    ResourceEventsApiService,
):
    """Service for resource events in the Devopness API."""


class ResourceEventServiceAsync(
    ResourceEventsApiServiceAsync,
):
    """Service for resource events in the Devopness API."""
