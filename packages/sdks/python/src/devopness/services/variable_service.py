"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..core import DevopnessResponse
from ..generated.api.variables_api import (
    VariablesApiService,
    VariablesApiServiceAsync,
)
from ..generated.models import VariableRelation

__all__ = ["VariableService", "VariableServiceAsync"]


class VariableService(
    VariablesApiService,
):
    """Service for variables in the Devopness API."""

    def list_environment_variables(
        self,
        environment_id: int,
        page: int | None = None,
        per_page: int | None = None,
        include_virtual_variables: bool | None = None,
        variable_target: str | None = None,
    ) -> DevopnessResponse[list[VariableRelation]]:
        """Return a list of all variables belonging to an environment."""
        return self.list_variables_by_resource_type(
            environment_id,
            "environment",
            page=page,
            per_page=per_page,
            include_virtual_variables=include_virtual_variables,
            variable_target=variable_target,
        )


class VariableServiceAsync(
    VariablesApiServiceAsync,
):
    """Async service for variables in the Devopness API."""

    async def list_environment_variables(
        self,
        environment_id: int,
        page: int | None = None,
        per_page: int | None = None,
        include_virtual_variables: bool | None = None,
        variable_target: str | None = None,
    ) -> DevopnessResponse[list[VariableRelation]]:
        """Return a list of all variables belonging to an environment."""
        return await self.list_variables_by_resource_type(
            environment_id,
            "environment",
            page=page,
            per_page=per_page,
            include_virtual_variables=include_virtual_variables,
            variable_target=variable_target,
        )
