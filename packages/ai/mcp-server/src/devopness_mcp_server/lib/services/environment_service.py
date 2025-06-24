from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import EnvironmentSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE, ExtraData
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
        - BEFORE executing this tool, show to the user all the existing projects,
          so that the user can choose the project to be used, using the tool
          `devopness_list_projects`.
        - DO NOT execute this tool without first confirming with the user which
          project ID to use.
        - EVEN if a candidate project is found by name or ID, please confirm with
          the user the project to be used.
        - Do not use environment 'name or ID' as project 'name or ID'.
        """
        await ensure_authenticated()

        response = await devopness.environments.list_project_environments(
            project_id,
            page,
            per_page=MAX_RESOURCES_PER_PAGE,
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
                    "- [{environment.name}]({environment.url_web_permalink})"
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
