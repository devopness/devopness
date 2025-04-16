from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.action_relation import ActionRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ProjectsActionsApiService(ApiBaseService):
    """
    ProjectsActionsApiService - Auto Generated
    """

    async def list_project_actions_by_resource_type(
        self,
        project_id: int,
        resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ActionRelation]]:
        """
        List project actions of a resource type
        """

        endpoint: str = f"/projects/{project_id}/actions/{resource_type}"f"/projects/{project_id}/actions/{resource_type}"

        response = await self.get(endpoint)

        return ApiResponse(response)
