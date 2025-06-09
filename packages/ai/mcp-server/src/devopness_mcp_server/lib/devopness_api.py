import os

from devopness import DevopnessClientAsync
from devopness.models import (
    UserLogin,
)

devopness = DevopnessClientAsync()


async def ensure_authenticated() -> None:
    user_email = os.environ.get("DEVOPNESS_USER_EMAIL")
    user_pass = os.environ.get("DEVOPNESS_USER_PASSWORD")

    if not user_email or not user_pass:
        raise Exception("DEVOPNESS_USER_EMAIL and DEVOPNESS_USER_PASSWORD must be set")

    # TODO: only invoke login if not yet authenticated
    user_data = UserLogin(email=user_email, password=user_pass)
    await devopness.users.login_user(user_data)
