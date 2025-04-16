from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.virtual_host import VirtualHost
from .models.virtual_host_environment_create import VirtualHostEnvironmentCreate
from .models.virtual_host_get_status import VirtualHostGetStatus
from .models.virtual_host_relation import VirtualHostRelation
from .models.virtual_host_update import VirtualHostUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class VirtualHostsApiService(ApiBaseService):
    """
    VirtualHostsApiService - Auto Generated
    """

    async def add_environment_virtual_host(
        self,
        environment_id: int,
        virtual_host_environment_create: VirtualHostEnvironmentCreate,
    ) -> ApiResponse[VirtualHost]:
        """
        Create a new virtual host
        """

        endpoint: str = f"/environments/{environment_id}/virtual-hosts"

        response = await self.post(endpoint, virtual_host_environment_create)

        return ApiResponse(response)

    async def delete_virtual_host(
        self,
        virtual_host_id: int,
    ) -> ApiResponse:
        """
        Delete a given virtual host
        """

        endpoint: str = f"/virtual-hosts/{virtual_host_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_status_virtual_host(
        self,
        virtual_host_id: int,
        virtual_host_get_status: VirtualHostGetStatus,
    ) -> ApiResponse:
        """
        Get current status of a virtual host
        """

        endpoint: str = f"/virtual-hosts/{virtual_host_id}/get-status"

        response = await self.post(endpoint, virtual_host_get_status)

        return ApiResponse(response)

    async def get_virtual_host(
        self,
        virtual_host_id: int,
    ) -> ApiResponse[VirtualHost]:
        """
        Get a virtual host by ID
        """

        endpoint: str = f"/virtual-hosts/{virtual_host_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_environment_virtual_hosts(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[VirtualHostRelation]]:
        """
        Return a list of all Virtual Hosts belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/virtual-hosts"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_virtual_host(
        self,
        virtual_host_id: int,
        virtual_host_update: VirtualHostUpdate,
    ) -> ApiResponse:
        """
        Update an existing virtual host
        """

        endpoint: str = f"/virtual-hosts/{virtual_host_id}"

        response = await self.put(endpoint, virtual_host_update)

        return ApiResponse(response)
