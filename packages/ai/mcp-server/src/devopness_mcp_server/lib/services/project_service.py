from typing import List

from devopness.models import ProjectRelation

from ..devopness_api import devopness, ensure_authenticated
from ..response import MCPResponse


class ProjectService:
    @staticmethod
    async def tool_list_projects() -> MCPResponse[List[ProjectRelation]]:
        await ensure_authenticated()
        response = await devopness.projects.list_projects()

        return MCPResponse.ok(
            response.data,
            [
                "Show the list in the following format:",
                "#N. {project.name} (ID: {project.id})",
                "Rules:"
                "1. If the user has multiple projects ask them to choose one"
                " of the listed project IDs to continue with the conversation.",
                "2. If the user has only one project, you can use it directly,"
                " and communicate with the user about it.",
            ],
        )
