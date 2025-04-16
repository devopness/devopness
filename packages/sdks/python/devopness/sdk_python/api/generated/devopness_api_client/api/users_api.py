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

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class UsersApiService(ApiBaseService):
    """
    UsersApiService - Auto Generated
    """

    async def add_user(
        self,
        user_create: UserCreate,
    ) -> ApiResponse:
        """
        Sign up/register a new user
        """

        endpoint: str = "/users"

        response = await self.post(endpoint, user_create)

        return ApiResponse(response)

    async def get_user(
        self,
        user_id: str,
    ) -> ApiResponse[User]:
        """
        Get a user by ID or URL Slug
        """

        endpoint: str = f"/users/{user_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_user_activity(
        self,
        user_id: str,
    ) -> ApiResponse[UserActivity]:
        """
        Get activity information for a user
        """

        endpoint: str = f"/users/{user_id}/activity"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_user_billing(
        self,
    ) -> ApiResponse[UserBilling]:
        """
        Get current user's billing info for active subscription
        """

        endpoint: str = "/users/billing"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_user_logout(
        self,
    ) -> ApiResponse:
        """
        Logout/revoke an existing token
        """

        endpoint: str = "/users/logout"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_user_me(
        self,
    ) -> ApiResponse[UserMe]:
        """
        Get details of the current user
        """

        endpoint: str = "/users/me"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def get_user_urls(
        self,
    ) -> ApiResponse[UserUrl]:
        """
        Get the authenticated user's URLs
        """

        endpoint: str = "/users/urls"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def login_user(
        self,
        user_login: UserLogin,
    ) -> ApiResponse[UserLoginResponse]:
        """
        Login/create a new token for the given credentials
        """

        endpoint: str = "/users/login"

        response = await self.post(endpoint, user_login)

        return ApiResponse(response)

    async def refresh_token_user(
        self,
        user_refresh_token: UserRefreshToken,
    ) -> ApiResponse[UserRefreshTokenResponse]:
        """
        Refresh an existing user access token
        """

        endpoint: str = "/users/refresh-token"

        response = await self.post(endpoint, user_refresh_token)

        return ApiResponse(response)

    async def resend_verification_user(
        self,
        user_resend_verification: UserResendVerification,
    ) -> ApiResponse:
        """
        Resend the verification email
        """

        endpoint: str = "/users/account/resend-verification"

        response = await self.post(endpoint, user_resend_verification)

        return ApiResponse(response)

    async def update_user(
        self,
        user_id: str,
        user_update: UserUpdate,
    ) -> ApiResponse:
        """
        Update an existing user
        """

        endpoint: str = f"/users/{user_id}"

        response = await self.put(endpoint, user_update)

        return ApiResponse(response)

    async def verify_user(
        self,
        user_verify: UserVerify,
    ) -> ApiResponse:
        """
        Activate the user account
        """

        endpoint: str = "/users/account/verify"

        response = await self.post(endpoint, user_verify)

        return ApiResponse(response)
