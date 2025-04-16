from packages.sdks.python.src.services.api_base_service import ApiBaseService

from pydantic import Field, StrictStr
from typing_extensions import Annotated
from devopness_api_client.models.user import User
from devopness_api_client.models.user_activity import UserActivity
from devopness_api_client.models.user_billing import UserBilling
from devopness_api_client.models.user_create import UserCreate
from devopness_api_client.models.user_login import UserLogin
from devopness_api_client.models.user_login_response import UserLoginResponse
from devopness_api_client.models.user_me import UserMe
from devopness_api_client.models.user_refresh_token import UserRefreshToken
from devopness_api_client.models.user_refresh_token_response import UserRefreshTokenResponse
from devopness_api_client.models.user_resend_verification import UserResendVerification
from devopness_api_client.models.user_update import UserUpdate
from devopness_api_client.models.user_url import UserUrl
from devopness_api_client.models.user_verify import UserVerify

class UsersApi(ApiBaseService):

    async def add_user(
        self,
        user_create: UserCreate,
    ) -> None:
        """
        
        """

        endpoint: str = f"/users"

        response = await self.post(endpoint)

        return response


    async def get_user(
        self,
        user_id: str,
    ) -> User:
        """
        
        """

        endpoint: str = f"/users/{user_id}"

        response = await self.get(endpoint)

        return response


    async def get_user_activity(
        self,
        user_id: str,
    ) -> UserActivity:
        """
        
        """

        endpoint: str = f"/users/{user_id}/activity"

        response = await self.get(endpoint)

        return response


    async def get_user_billing(
        self,
    ) -> UserBilling:
        """
        
        """

        endpoint: str = f"/users/billing"

        response = await self.get(endpoint)

        return response


    async def get_user_logout(
        self,
    ) -> None:
        """
        
        """

        endpoint: str = f"/users/logout"

        response = await self.get(endpoint)

        return response


    async def get_user_me(
        self,
    ) -> UserMe:
        """
        
        """

        endpoint: str = f"/users/me"

        response = await self.get(endpoint)

        return response


    async def get_user_urls(
        self,
    ) -> UserUrl:
        """
        
        """

        endpoint: str = f"/users/urls"

        response = await self.get(endpoint)

        return response


    async def login_user(
        self,
        user_login: UserLogin,
    ) -> UserLoginResponse:
        """
        
        """

        endpoint: str = f"/users/login"

        response = await self.post(endpoint)

        return response


    async def refresh_token_user(
        self,
        user_refresh_token: UserRefreshToken,
    ) -> UserRefreshTokenResponse:
        """
        
        """

        endpoint: str = f"/users/refresh-token"

        response = await self.post(endpoint)

        return response


    async def resend_verification_user(
        self,
        user_resend_verification: UserResendVerification,
    ) -> None:
        """
        
        """

        endpoint: str = f"/users/account/resend-verification"

        response = await self.post(endpoint)

        return response


    async def update_user(
        self,
        user_id: str,
        user_update: UserUpdate,
    ) -> None:
        """
        
        """

        endpoint: str = f"/users/{user_id}"

        response = await self.put(endpoint)

        return response


    async def verify_user(
        self,
        user_verify: UserVerify,
    ) -> None:
        """
        
        """

        endpoint: str = f"/users/account/verify"

        response = await self.post(endpoint)

        return response

