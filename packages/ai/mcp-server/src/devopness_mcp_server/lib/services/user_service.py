from devopness.models import UserMe

from ..devopness_api import devopness, ensure_authenticated


class UserService:
    @staticmethod
    async def tool_get_user_profile() -> UserMe:
        await ensure_authenticated()
        current_user = await devopness.users.get_user_me()

        return current_user.data
