from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import EnvironmentSummary
from ..response import MCPResponse
from ..utils import get_choose_resource_instructions, get_format_list_instructions


class EnvironmentService:
    @staticmethod
    async def tool_list_environments(
        project_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[EnvironmentSummary]]:
        """
        Rules:
        1. DO NOT execute this tool without first confirming with the user which
          project ID to use.
        """
        await ensure_authenticated()
        response = await devopness.environments.list_project_environments(
            project_id,
            page,
        )

        environments = [
            EnvironmentSummary.from_sdk_model(environment)
            for environment in response.data
        ]

        return MCPResponse.ok(
            environments,
            [
                get_format_list_instructions(
                    "#N. {environment.name} (ID: {environment.id})",
                    [
                        "Description: {environment.description}",
                    ],
                ),
                get_choose_resource_instructions(
                    "environment",
                ),
            ],
        )
