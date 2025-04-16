from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.resource_event import ResourceEvent
from .models.resource_event_relation import ResourceEventRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ResourceEventsApiService(ApiBaseService):
    """
    ResourceEventsApiService - Auto Generated
    """

    async def add_resource_event(
        self,
        resource_id: str,
        resource_type: str,
    ) -> ApiResponse[ResourceEvent]:
        """
        Process event for a resource
        """

        endpoint: str = f"/events/{resource_type}/{resource_id}"f"/events/{resource_type}/{resource_id}"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def list_resource_events_by_resource_type(
        self,
        resource_id: int,
        resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ResourceEventRelation]]:
        """
        List events of a resource type
        """

        endpoint: str = f"/events/{resource_type}/{resource_id}"f"/events/{resource_type}/{resource_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)
