from typing import List

from ..devopness_api import devopness, ensure_authenticated
from ..models import ProjectSummary
from ..response import MCPResponse
from ..types import TypePage
from ..utils import get_instructions_choose_resource, get_instructions_format_list


class ProjectService:
    @staticmethod
    async def tool_list_projects(
        page: TypePage,
    ) -> MCPResponse[List[ProjectSummary]]:
        await ensure_authenticated()

        response = await devopness.projects.list_projects(page)

        projects = [ProjectSummary.from_sdk_model(project) for project in response.data]

        return MCPResponse.ok(
            projects,
            [
                get_instructions_format_list(
                    "#N. {project.name} (ID: {project.id})",
                ),
                get_instructions_choose_resource(
                    "project",
                ),
            ],
        )
