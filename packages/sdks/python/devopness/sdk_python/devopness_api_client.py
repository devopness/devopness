"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from .services.user_service import UserService


class DevopnessApiClient:
    users: UserService

    def __init__(self) -> None:
        self.users = UserService()
