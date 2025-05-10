"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.resource_links_api import (
    ResourceLinksApiService,
    ResourceLinksApiServiceAsync,
)

__all__ = ["ResourceLinkService", "ResourceLinkServiceAsync"]


class ResourceLinkService(
    ResourceLinksApiService,
):
    """Service for resource links in the Devopness API."""


class ResourceLinkServiceAsync(
    ResourceLinksApiServiceAsync,
):
    """Service for resource links in the Devopness API."""
