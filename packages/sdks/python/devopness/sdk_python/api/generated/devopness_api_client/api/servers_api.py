from pydantic import Field, StrictBool, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.server import Server
from devopness_api_client.models.server_command import ServerCommand
from devopness_api_client.models.server_environment_create import ServerEnvironmentCreate
from devopness_api_client.models.server_relation import ServerRelation
from devopness_api_client.models.server_update import ServerUpdate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class ServersApiService(ApiBaseService):
    """
    ServersApiService - Auto Generated
    """

    async def add_environment_server(
        self,
        environment_id: int,
        server_environment_create: ServerEnvironmentCreate,
    ) -> ApiResponse[Server]:
        """
        Creates a server and link it to the given environment
        """

        endpoint: str = f"/environments/{environment_id}/servers"

        response = await self.post(endpoint, server_environment_create)

        return ApiResponse(response)

    async def connect_server(
        self,
        activation_token: str,
        server_id: int,
    ) -> ApiResponse[str]:
        """
        Connect a server to devopness platform
        """

        endpoint: str = f"/servers/{server_id}/connect/{activation_token}"f"/servers/{server_id}/connect/{activation_token}"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def delete_server(
        self,
        server_id: int,
        destroy_server_disks: bool = None,
    ) -> ApiResponse:
        """
        Delete a given server
        """

        endpoint: str = f"/servers/{server_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_server(
        self,
        server_id: int,
    ) -> ApiResponse[Server]:
        """
        Get a server by ID
        """

        endpoint: str = f"/servers/{server_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_server_commands(
        self,
        server_id: int,
    ) -> ApiResponse[ServerCommand]:
        """
        Get commands to be executed on the given server
        """

        endpoint: str = f"/servers/{server_id}/commands"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_status_server(
        self,
        server_id: int,
    ) -> ApiResponse:
        """
        Get current status of the server on the cloud provider
        """

        endpoint: str = f"/servers/{server_id}/get-status"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def list_environment_servers(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ServerRelation]]:
        """
        Return a list of all servers belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/servers"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def restart_server(
        self,
        server_id: int,
    ) -> ApiResponse:
        """
        Restart a current running server
        """

        endpoint: str = f"/servers/{server_id}/restart"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def rotate_key_server(
        self,
        server_id: int,
    ) -> ApiResponse:
        """
        Rotate the key used to access the server
        """

        endpoint: str = f"/servers/{server_id}/rotate-key"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def start_server(
        self,
        server_id: int,
    ) -> ApiResponse:
        """
        Start a previously stopped server
        """

        endpoint: str = f"/servers/{server_id}/start"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def stop_server(
        self,
        server_id: int,
    ) -> ApiResponse:
        """
        Stop a running server
        """

        endpoint: str = f"/servers/{server_id}/stop"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def update_server(
        self,
        server_id: int,
        server_update: ServerUpdate,
    ) -> ApiResponse:
        """
        Update an existing server
        """

        endpoint: str = f"/servers/{server_id}"

        response = await self.put(endpoint, server_update)

        return ApiResponse(response)
