"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.variables_api import (
    VariablesApiService,
    VariablesApiServiceAsync,
)

__all__ = ["VariableService", "VariableServiceAsync"]


class VariableService(
    VariablesApiService,
):
    """Service for variables in the Devopness API."""


class VariableServiceAsync(
    VariablesApiServiceAsync,
):
    """Async service for variables in the Devopness API."""
