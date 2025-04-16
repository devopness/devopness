from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.hook_relation import HookRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ApplicationsHooksApiService(ApiBaseService):
    """
    ApplicationsHooksApiService - Auto Generated
    """

    async def list_application_hooks(
        self,
        application_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[HookRelation]]:
        """
        List all hooks in an application
        """

        endpoint: str = f"/applications/{application_id}/hooks"

        response = await self.get(endpoint)

        return ApiResponse(response)
