"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Optional

from .services import (
    ApiBaseService,
    DevopnessClientConfig,
    UserService,
)


class DevopnessClient:
    """
    DevopnessApiClient provides an interface to the Devopness API.
    """

    users: UserService

    def __init__(
        self,
        config: Optional[DevopnessClientConfig] = None,
    ) -> None:
        config = config or DevopnessClientConfig()

        self.users = UserService(config)

    def __set_access_token(self, access_token: str) -> None:
        # pylint: disable=protected-access
        ApiBaseService._access_token = access_token

    def __get_access_token(self) -> str:
        # pylint: disable=protected-access
        return ApiBaseService._access_token  # type: ignore

    access_token = property(fset=__set_access_token, fget=__get_access_token)
