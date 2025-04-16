from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.environment import Environment
from .models.environment_project_create import EnvironmentProjectCreate
from .models.environment_relation import EnvironmentRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ProjectsEnvironmentsApiService(ApiBaseService):
    """
    ProjectsEnvironmentsApiService - Auto Generated
    """

    async def add_project_environment(
        self,
        project_id: int,
        environment_project_create: EnvironmentProjectCreate,
    ) -> ApiResponse[Environment]:
        """
        Create a new environment on the current project
        """

        endpoint: str = f"/projects/{project_id}/environments"

        response = await self.post(endpoint, environment_project_create)

        return ApiResponse(response)

    async def list_project_environments(
        self,
        project_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[EnvironmentRelation]]:
        """
        Return a list of all environments belonging to a project
        """

        endpoint: str = f"/projects/{project_id}/environments"

        response = await self.get(endpoint)

        return ApiResponse(response)
