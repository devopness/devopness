from pydantic import Field, StrictInt, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.project_relation import ProjectRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class UsersProjectsApiService(ApiBaseService):
    """
    UsersProjectsApiService - Auto Generated
    """

    async def list_user_projects(
        self,
        user_id: str,
        page: int = None,
        per_page: int = None,
        subscription_id: int = None,
    ) -> ApiResponse[List[ProjectRelation]]:
        """
        Return a list of all projects owned by a user
        """

        endpoint: str = f"/users/{user_id}/projects"

        response = await self.get(endpoint)

        return ApiResponse(response)
