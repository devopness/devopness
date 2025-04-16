from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.organization import Organization
from devopness_api_client.models.organization_activity import OrganizationActivity
from devopness_api_client.models.organization_create import OrganizationCreate
from devopness_api_client.models.organization_relation import OrganizationRelation
from devopness_api_client.models.organization_update import OrganizationUpdate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class OrganizationsApiService(ApiBaseService):
    """
    OrganizationsApiService - Auto Generated
    """

    async def add_organization(
        self,
        organization_create: OrganizationCreate,
    ) -> ApiResponse[Organization]:
        """
        Create a new organization
        """

        endpoint: str = "/organizations"

        response = await self.post(endpoint, organization_create)

        return ApiResponse(response)

    async def get_organization(
        self,
        organization_id: str,
    ) -> ApiResponse[Organization]:
        """
        Get an organization by ID or URL Slug
        """

        endpoint: str = f"/organizations/{organization_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_organization_activity(
        self,
        organization_id: str,
    ) -> ApiResponse[OrganizationActivity]:
        """
        Get activity information for an organization
        """

        endpoint: str = f"/organizations/{organization_id}/activity"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_organizations(
        self,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[OrganizationRelation]]:
        """
        List all organizations of authenticated user
        """

        endpoint: str = "/organizations"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_organization(
        self,
        organization_id: str,
        organization_update: OrganizationUpdate,
    ) -> ApiResponse:
        """
        Update an existing organization
        """

        endpoint: str = f"/organizations/{organization_id}"

        response = await self.put(endpoint, organization_update)

        return ApiResponse(response)
