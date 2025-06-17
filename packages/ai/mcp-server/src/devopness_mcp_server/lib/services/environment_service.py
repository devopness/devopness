from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import Environment
from ..response import MCPResponse


class EnvironmentService:
    @staticmethod
    async def tool_list_environments(
        project_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[Environment]]:
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
            Environment(
                id=environment.id,
                name=environment.name,
                description=environment.description,
            )
            for environment in response.data
        ]

        return MCPResponse.ok(
            environments,
            [
                "Show the list in the following format:",
                "#N. {environment.name} (ID: {environment.id})",
                "   - Description: {environment.description}",
                "Rules:"
                "1. If the user has multiple environments ask them to choose one"
                " of the listed environment IDs to continue with the conversation.",
                "2. If the user has only one environment, you can use it directly,"
                " and communicate with the user about it.",
            ],
        )
