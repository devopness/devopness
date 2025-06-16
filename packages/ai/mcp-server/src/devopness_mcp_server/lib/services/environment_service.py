from typing import List

from devopness.models import EnvironmentRelation

from ..devopness_api import devopness, ensure_authenticated
from ..response import MCPResponse


class EnvironmentService:
    @staticmethod
    async def tool_list_environments(
        project_id: int,
    ) -> MCPResponse[List[EnvironmentRelation]]:
        """
        Rules:
        1. DO NOT execute this tool without first confirming with the user which
          project ID to use.
        """
        await ensure_authenticated()
        response = await devopness.environments.list_project_environments(project_id)

        return MCPResponse.ok(
            response.data,
            [
                "Show the list in the following format:",
                "#N. {environment.name} (ID: {environment.id})",
                "   - Type: {environment.type}",
                "   - Description: {environment.description}",
                "Rules:"
                "1. If the user has multiple environments ask them to choose one"
                " of the listed environment IDs to continue with the conversation.",
                "2. If the user has only one environment, you can use it directly,"
                " and communicate with the user about it.",
            ],
        )
