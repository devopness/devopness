from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import ProjectSummary
from ..response import MCPResponse
from ..utils import get_choose_resource_instructions, get_format_list_instructions


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
                get_format_list_instructions(
                    "#N. {project.name} (ID: {project.id})",
                ),
                get_choose_resource_instructions(
                    "project",
                ),
            ],
        )
