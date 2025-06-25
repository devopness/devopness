from typing import List

from pydantic import Field

from ..devopness_api import devopness, ensure_authenticated
from ..models import ProjectSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE
from ..utils import get_instructions_choose_resource, get_instructions_format_list


class ProjectService:
    @staticmethod
    async def tool_list_projects(
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[ProjectSummary]]:
        await ensure_authenticated()

        response = await devopness.projects.list_projects(
            page,
            per_page=MAX_RESOURCES_PER_PAGE,
        )

        projects = [ProjectSummary.from_sdk_model(project) for project in response.data]

        return MCPResponse.ok(
            projects,
            [
                get_instructions_format_list(
                    "- [{project.name}]({project.url_web_permalink})"
                    " (ID: {project.id})",
                ),
                f"Founded {len(projects)} projects.",
                get_instructions_choose_resource(
                    "project",
                ),
                "EVEN if a candidate project is found by name or ID, please confirm"
                " with the user the project to be used.",
                "Do not use environment 'name or ID' as project 'name or ID'.",
            ],
        )
