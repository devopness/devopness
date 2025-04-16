from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.repository import Repository
from devopness_api_client.models.repository_relation import RepositoryRelation

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class CredentialsRepositoriesApiService(ApiBaseService):
    """
    CredentialsRepositoriesApiService - Auto Generated
    """

    async def get_credential_repository(
        self,
        credential_id: int,
        repository_name: str,
        repository_owner: str,
    ) -> ApiResponse[Repository]:
        """
        Get details of a repository by its name
        """

        endpoint: str = f"/credentials/{credential_id}/repositories/{repository_owner}/{repository_name}"f"/credentials/{credential_id}/repositories/{repository_owner}/{repository_name}"f"/credentials/{credential_id}/repositories/{repository_owner}/{repository_name}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_credential_repositories(
        self,
        credential_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[RepositoryRelation]]:
        """
        Return a list of all repositories belonging to the source provider linked to the credential
        """

        endpoint: str = f"/credentials/{credential_id}/repositories"

        response = await self.get(endpoint)

        return ApiResponse(response)
