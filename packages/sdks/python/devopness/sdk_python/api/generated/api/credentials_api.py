from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.credential import Credential
from .models.credential_environment_create import CredentialEnvironmentCreate
from .models.credential_relation import CredentialRelation
from .models.credential_setting import CredentialSetting
from .models.credential_update import CredentialUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class CredentialsApiService(ApiBaseService):
    """
    CredentialsApiService - Auto Generated
    """

    async def add_environment_credential(
        self,
        environment_id: int,
        credential_environment_create: CredentialEnvironmentCreate,
    ) -> ApiResponse[Credential]:
        """
        Add a Credential to the given environment
        """

        endpoint: str = f"/environments/{environment_id}/credentials"

        response = await self.post(endpoint, credential_environment_create)

        return ApiResponse(response)

    async def delete_credential(
        self,
        credential_id: int,
    ) -> ApiResponse:
        """
        Delete a given credential
        """

        endpoint: str = f"/credentials/{credential_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_credential(
        self,
        credential_id: int,
    ) -> ApiResponse[Credential]:
        """
        Get a credential by ID
        """

        endpoint: str = f"/credentials/{credential_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_environment_credential_settings(
        self,
        environment_id: int,
        provider_code: str,
    ) -> ApiResponse[CredentialSetting]:
        """
        Return provider settings
        """

        endpoint: str = f"/environments/{environment_id}/credentials/{provider_code}/settings"f"/environments/{environment_id}/credentials/{provider_code}/settings"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_status_credential(
        self,
        credential_id: int,
    ) -> ApiResponse:
        """
        Get current status of a credential on its provider
        """

        endpoint: str = f"/credentials/{credential_id}/get-status"

        response = await self.post(endpoint)

        return ApiResponse(response)

    async def list_environment_credentials(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
        provider_code: str = None,
        provider_type: str = None,
    ) -> ApiResponse[List[CredentialRelation]]:
        """
        Return a list of all Credentials belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/credentials"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_credential(
        self,
        credential_id: int,
        credential_update: CredentialUpdate,
    ) -> ApiResponse:
        """
        Update an existing Credential
        """

        endpoint: str = f"/credentials/{credential_id}"

        response = await self.put(endpoint, credential_update)

        return ApiResponse(response)
