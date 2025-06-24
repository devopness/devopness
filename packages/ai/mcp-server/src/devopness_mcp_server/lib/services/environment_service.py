from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import EnvironmentSummary
from ..response import MCPResponse
from ..types import ExtraData
from ..utils import get_instructions_choose_resource, get_instructions_format_list


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
            EnvironmentSummary.from_sdk_model(
                environment,
                ExtraData(
                    url_web_permalink=f"https://app.devopness.com/projects/{project_id}/environments/{environment.id}",
                ),
            )
            for environment in response.data
        ]

        return MCPResponse.ok(
            environments,
            [
                get_instructions_format_list(
                    "`N.` [{environment.name}]({environment.url_web_permalink})"
                    " (ID: {environment.id})",
                    [
                        "Description: {environment.description}",
                    ],
                ),
                f"Founded {len(environments)} environments.",
                get_instructions_choose_resource(
                    "environment",
                ),
            ],
        )
