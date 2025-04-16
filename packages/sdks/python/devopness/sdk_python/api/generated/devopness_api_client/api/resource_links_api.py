from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.resource_link_relation import ResourceLinkRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ResourceLinksApiService(ApiBaseService):
    """
    ResourceLinksApiService - Auto Generated
    """

    async def link_resource_link_to_resource_link(
        self,
        child_id: int,
        child_type: str,
        resource_id: int,
        resource_type: str,
    ) -> ApiResponse:
        """
        Link the given resources
        """

        endpoint: str = f"/resource-links/{resource_type}/{resource_id}/{child_type}/{child_id}/link"f"/resource-links/{resource_type}/{resource_id}/{child_type}/{child_id}/link"f"/resource-links/{resource_type}/{resource_id}/{child_type}/{child_id}/link"f"/resource-links/{resource_type}/{resource_id}/{child_type}/{child_id}/link"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def list_resource_links_by_resource_type(
        self,
        resource_id: int,
        resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ResourceLinkRelation]]:
        """
        List linked resources of the given resource
        """

        endpoint: str = f"/resource-links/{resource_type}/{resource_id}"f"/resource-links/{resource_type}/{resource_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_resource_links_by_resource_type_and_link_type(
        self,
        link_type: str,
        resource_id: int,
        resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ResourceLinkRelation]]:
        """
        List linked resources of specified link type
        """

        endpoint: str = f"/resource-links/{resource_type}/{resource_id}/{link_type}"f"/resource-links/{resource_type}/{resource_id}/{link_type}"f"/resource-links/{resource_type}/{resource_id}/{link_type}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def unlink_resource_link_from_resource_link(
        self,
        child_id: int,
        child_type: str,
        resource_id: int,
        resource_type: str,
    ) -> ApiResponse:
        """
        Delete a given resource link
        """

        endpoint: str = f"/resource-links/{resource_type}/{resource_id}/{child_type}/{child_id}/unlink"f"/resource-links/{resource_type}/{resource_id}/{child_type}/{child_id}/unlink"f"/resource-links/{resource_type}/{resource_id}/{child_type}/{child_id}/unlink"f"/resource-links/{resource_type}/{resource_id}/{child_type}/{child_id}/unlink"

        response = await self.delete(endpoint)

        return ApiResponse(response)
