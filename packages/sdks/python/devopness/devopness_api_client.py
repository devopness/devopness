"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from .services import UserService


class DevopnessApiClient:
    """
    DevopnessApiClient provides an interface to the Devopness API.
    """

    users: UserService

    def __init__(self) -> None:
        self.users = UserService()
