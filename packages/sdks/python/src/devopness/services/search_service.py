"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.search_api import (
    SearchApiService,
    SearchApiServiceAsync,
)

__all__ = ["SearchService", "SearchServiceAsync"]


class SearchService(
    SearchApiService,
):
    """Service for search in the Devopness API."""


class SearchServiceAsync(
    SearchApiServiceAsync,
):
    """Async service for search in the Devopness API."""
