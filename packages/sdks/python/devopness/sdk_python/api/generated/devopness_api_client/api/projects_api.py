from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.project import Project
from devopness_api_client.models.project_create import ProjectCreate
from devopness_api_client.models.project_relation import ProjectRelation
from devopness_api_client.models.project_update import ProjectUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ProjectsApiService(ApiBaseService):
    """
    ProjectsApiService - Auto Generated
    """

    async def add_project(
        self,
        project_create: ProjectCreate,
    ) -> ApiResponse[Project]:
        """
        Create a project for a user or an organization
        """

        endpoint: str = "/projects"

        response = await self.post(endpoint, project_create)

        return ApiResponse(response)

    async def get_project(
        self,
        project_id: int,
    ) -> ApiResponse[Project]:
        """
        Get a Project by ID
        """

        endpoint: str = f"/projects/{project_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_projects(
        self,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ProjectRelation]]:
        """
        Return a list of all projects the current user has access to
        """

        endpoint: str = "/projects"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_project(
        self,
        project_id: int,
        project_update: ProjectUpdate,
    ) -> ApiResponse:
        """
        Update an existing Project
        """

        endpoint: str = f"/projects/{project_id}"

        response = await self.put(endpoint, project_update)

        return ApiResponse(response)
