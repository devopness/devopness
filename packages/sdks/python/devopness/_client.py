"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Optional

from ._base import DevopnessBaseService
from ._client_config import DevopnessClientConfig
from .services import UserService

__all__ = ["DevopnessClient"]


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
        DevopnessBaseService._access_token = access_token

    def __get_access_token(self) -> str:
        # pylint: disable=protected-access
        return DevopnessBaseService._access_token  # type: ignore

    access_token = property(fset=__set_access_token, fget=__get_access_token)
