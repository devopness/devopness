from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.daemon import Daemon
from devopness_api_client.models.daemon_environment_create import DaemonEnvironmentCreate
from devopness_api_client.models.daemon_get_status import DaemonGetStatus
from devopness_api_client.models.daemon_relation import DaemonRelation
from devopness_api_client.models.daemon_restart import DaemonRestart
from devopness_api_client.models.daemon_start import DaemonStart
from devopness_api_client.models.daemon_stop import DaemonStop
from devopness_api_client.models.daemon_update import DaemonUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class DaemonsApiService(ApiBaseService):
    """
    DaemonsApiService - Auto Generated
    """

    async def add_environment_daemon(
        self,
        environment_id: int,
        daemon_environment_create: DaemonEnvironmentCreate,
    ) -> ApiResponse[Daemon]:
        """
        Add a Daemon to the given environment
        """

        endpoint: str = f"/environments/{environment_id}/daemons"

        response = await self.post(endpoint, daemon_environment_create)

        return ApiResponse(response)

    async def delete_daemon(
        self,
        daemon_id: int,
    ) -> ApiResponse:
        """
        Delete a given Daemon
        """

        endpoint: str = f"/daemons/{daemon_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_daemon(
        self,
        daemon_id: int,
    ) -> ApiResponse[Daemon]:
        """
        Get a Daemon by ID
        """

        endpoint: str = f"/daemons/{daemon_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_status_daemon(
        self,
        daemon_id: int,
        daemon_get_status: DaemonGetStatus,
    ) -> ApiResponse:
        """
        Get current status of a daemon
        """

        endpoint: str = f"/daemons/{daemon_id}/get-status"

        response = await self.post(endpoint, daemon_get_status)

        return ApiResponse(response)

    async def list_environment_daemons(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[DaemonRelation]]:
        """
        Return a list of all Daemons belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/daemons"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def restart_daemon(
        self,
        daemon_id: int,
        daemon_restart: DaemonRestart,
    ) -> ApiResponse:
        """
        Restart a Daemon
        """

        endpoint: str = f"/daemons/{daemon_id}/restart"

        response = await self.post(endpoint, daemon_restart)

        return ApiResponse(response)

    async def start_daemon(
        self,
        daemon_id: int,
        daemon_start: DaemonStart,
    ) -> ApiResponse:
        """
        Start a Daemon
        """

        endpoint: str = f"/daemons/{daemon_id}/start"

        response = await self.post(endpoint, daemon_start)

        return ApiResponse(response)

    async def stop_daemon(
        self,
        daemon_id: int,
        daemon_stop: DaemonStop,
    ) -> ApiResponse:
        """
        Stop a Daemon
        """

        endpoint: str = f"/daemons/{daemon_id}/stop"

        response = await self.post(endpoint, daemon_stop)

        return ApiResponse(response)

    async def update_daemon(
        self,
        daemon_id: int,
        daemon_update: DaemonUpdate,
    ) -> ApiResponse:
        """
        Update an existing Daemon
        """

        endpoint: str = f"/daemons/{daemon_id}"

        response = await self.put(endpoint, daemon_update)

        return ApiResponse(response)
