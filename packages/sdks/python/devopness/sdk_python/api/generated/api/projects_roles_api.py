from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.role import Role
from .models.role_project_create import RoleProjectCreate
from .models.role_relation import RoleRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ProjectsRolesApiService(ApiBaseService):
    """
    ProjectsRolesApiService - Auto Generated
    """

    async def add_project_role(
        self,
        project_id: int,
        role_project_create: RoleProjectCreate,
    ) -> ApiResponse[Role]:
        """
        Create a role to a given project
        """

        endpoint: str = f"/projects/{project_id}/roles"

        response = await self.post(endpoint, role_project_create)

        return ApiResponse(response)

    async def list_project_roles(
        self,
        project_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[RoleRelation]]:
        """
        List all roles from a project
        """

        endpoint: str = f"/projects/{project_id}/roles"

        response = await self.get(endpoint)

        return ApiResponse(response)
