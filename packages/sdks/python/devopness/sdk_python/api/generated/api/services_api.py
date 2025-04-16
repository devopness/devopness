from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.service import Service
from .models.service_environment_create import ServiceEnvironmentCreate
from .models.service_get_status import ServiceGetStatus
from .models.service_relation import ServiceRelation
from .models.service_reload import ServiceReload
from .models.service_restart import ServiceRestart
from .models.service_start import ServiceStart
from .models.service_stop import ServiceStop
from .models.service_update import ServiceUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ServicesApiService(ApiBaseService):
    """
    ServicesApiService - Auto Generated
    """

    async def add_environment_service(
        self,
        environment_id: int,
        service_environment_create: ServiceEnvironmentCreate,
    ) -> ApiResponse[Service]:
        """
        Add a Service to the given environment
        """

        endpoint: str = f"/environments/{environment_id}/services"

        response = await self.post(endpoint, service_environment_create)

        return ApiResponse(response)

    async def delete_service(
        self,
        service_id: int,
    ) -> ApiResponse:
        """
        Delete a given service
        """

        endpoint: str = f"/services/{service_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_service(
        self,
        service_id: int,
    ) -> ApiResponse[Service]:
        """
        Get details of a single service
        """

        endpoint: str = f"/services/{service_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_status_service(
        self,
        service_id: int,
        service_get_status: ServiceGetStatus,
    ) -> ApiResponse:
        """
        Get current status of a service
        """

        endpoint: str = f"/services/{service_id}/get-status"

        response = await self.post(endpoint, service_get_status)

        return ApiResponse(response)

    async def list_environment_services(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ServiceRelation]]:
        """
        Return a list of all services belonging to a environment
        """

        endpoint: str = f"/environments/{environment_id}/services"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def reload_service(
        self,
        service_id: int,
        service_reload: ServiceReload,
    ) -> ApiResponse:
        """
        Reload a service
        """

        endpoint: str = f"/services/{service_id}/reload"

        response = await self.post(endpoint, service_reload)

        return ApiResponse(response)

    async def restart_service(
        self,
        service_id: int,
        service_restart: ServiceRestart,
    ) -> ApiResponse:
        """
        Restart a service
        """

        endpoint: str = f"/services/{service_id}/restart"

        response = await self.post(endpoint, service_restart)

        return ApiResponse(response)

    async def start_service(
        self,
        service_id: int,
        service_start: ServiceStart,
    ) -> ApiResponse:
        """
        Start a service
        """

        endpoint: str = f"/services/{service_id}/start"

        response = await self.post(endpoint, service_start)

        return ApiResponse(response)

    async def stop_service(
        self,
        service_id: int,
        service_stop: ServiceStop,
    ) -> ApiResponse:
        """
        Stop a service
        """

        endpoint: str = f"/services/{service_id}/stop"

        response = await self.post(endpoint, service_stop)

        return ApiResponse(response)

    async def update_service(
        self,
        service_id: int,
        service_update: ServiceUpdate,
    ) -> ApiResponse:
        """
        Update an existing service
        """

        endpoint: str = f"/services/{service_id}"

        response = await self.put(endpoint, service_update)

        return ApiResponse(response)
