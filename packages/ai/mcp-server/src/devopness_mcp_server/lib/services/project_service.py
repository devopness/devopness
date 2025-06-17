from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import ProjectSummary
from ..response import MCPResponse


class ProjectService:
    @staticmethod
    async def tool_list_projects(
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[ProjectSummary]]:
        await ensure_authenticated()
        response = await devopness.projects.list_projects(page)

        projects = [
            ProjectSummary(
                id=project.id,
                name=project.name,
            )
            for project in response.data
        ]

        return MCPResponse.ok(
            projects,
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
