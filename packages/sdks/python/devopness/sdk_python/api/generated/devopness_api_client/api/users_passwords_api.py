from pydantic import Field, StrictStr
from typing_extensions import Annotated
from devopness_api_client.models.password_reset_response import PasswordResetResponse
from devopness_api_client.models.password_user_reset import PasswordUserReset
from devopness_api_client.models.password_user_send_reset_link import PasswordUserSendResetLink

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class UsersPasswordsApiService(ApiBaseService):
    """
    UsersPasswordsApiService - Auto Generated
    """

    async def reset_user_password(
        self,
        password_user_reset: PasswordUserReset,
    ) -> ApiResponse[PasswordResetResponse]:
        """
        Reset the user password
        """

        endpoint: str = "/users/password/reset"

        response = await self.post(endpoint, password_user_reset)

        return ApiResponse(response)

    async def send_reset_link_user_password(
        self,
        password_user_send_reset_link: PasswordUserSendResetLink,
    ) -> ApiResponse:
        """
        Send the password reset link to user's email
        """

        endpoint: str = "/users/password/send-reset-link"

        response = await self.post(endpoint, password_user_send_reset_link)

        return ApiResponse(response)
