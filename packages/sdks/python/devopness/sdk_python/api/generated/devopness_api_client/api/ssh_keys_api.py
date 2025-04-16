from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.ssh_key import SshKey
from devopness_api_client.models.ssh_key_environment_create import SshKeyEnvironmentCreate
from devopness_api_client.models.ssh_key_relation import SshKeyRelation
from devopness_api_client.models.ssh_key_update import SshKeyUpdate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class SSHKeysApiService(ApiBaseService):
    """
    SSHKeysApiService - Auto Generated
    """

    async def add_environment_ssh_key(
        self,
        environment_id: int,
        ssh_key_environment_create: SshKeyEnvironmentCreate,
    ) -> ApiResponse[SshKey]:
        """
        Create an SSH key and link it to the given environment
        """

        endpoint: str = f"/environments/{environment_id}/ssh-keys"

        response = await self.post(endpoint, ssh_key_environment_create)

        return ApiResponse(response)

    async def delete_ssh_key(
        self,
        ssh_key_id: int,
    ) -> ApiResponse:
        """
        Delete a given SSH key
        """

        endpoint: str = f"/ssh-keys/{ssh_key_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_ssh_key(
        self,
        ssh_key_id: int,
    ) -> ApiResponse[SshKey]:
        """
        Get a SSH key by ID
        """

        endpoint: str = f"/ssh-keys/{ssh_key_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_environment_ssh_keys(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[SshKeyRelation]]:
        """
        Return a list of all SSH keys added to an environment
        """

        endpoint: str = f"/environments/{environment_id}/ssh-keys"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_ssh_key(
        self,
        ssh_key_id: int,
        ssh_key_update: SshKeyUpdate,
    ) -> ApiResponse:
        """
        Update an existing SSH key
        """

        endpoint: str = f"/ssh-keys/{ssh_key_id}"

        response = await self.put(endpoint, ssh_key_update)

        return ApiResponse(response)
