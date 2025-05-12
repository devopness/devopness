"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.network_rules_api import (
    NetworkRulesApiService,
    NetworkRulesApiServiceAsync,
)

__all__ = ["NetworkRuleService", "NetworkRuleServiceAsync"]


class NetworkRuleService(
    NetworkRulesApiService,
):
    """Service for network rules in the Devopness API."""


class NetworkRuleServiceAsync(
    NetworkRulesApiServiceAsync,
):
    """Async service for network rules in the Devopness API."""
