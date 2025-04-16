from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.social_account import SocialAccount
from .models.social_account_create import SocialAccountCreate
from .models.social_account_relation import SocialAccountRelation
from .models.social_account_status import SocialAccountStatus

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class SocialAccountsApiService(ApiBaseService):
    """
    SocialAccountsApiService - Auto Generated
    """

    async def add_social_account(
        self,
        social_account_create: SocialAccountCreate,
    ) -> ApiResponse[SocialAccount]:
        """
        Add a social account
        """

        endpoint: str = "/social-accounts"

        response = await self.post(endpoint, social_account_create)

        return ApiResponse(response)

    async def delete_social_account(
        self,
        social_account_id: int,
    ) -> ApiResponse:
        """
        Delete a given social account
        """

        endpoint: str = f"/social-accounts/{social_account_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_social_account(
        self,
        social_account_provider: str,
    ) -> ApiResponse[SocialAccount]:
        """
        Get a social account by provider name
        """

        endpoint: str = f"/social-accounts/{social_account_provider}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_social_account_status(
        self,
        social_account_provider: str,
    ) -> ApiResponse[SocialAccountStatus]:
        """
        Get status of a social account
        """

        endpoint: str = f"/social-accounts/{social_account_provider}/status"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_social_accounts(
        self,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[SocialAccountRelation]]:
        """
        Return a list of all social accounts of the current user
        """

        endpoint: str = "/social-accounts"

        response = await self.get(endpoint)

        return ApiResponse(response)
