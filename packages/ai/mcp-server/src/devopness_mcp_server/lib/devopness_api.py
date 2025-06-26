"""
Initializes an asynchronous Devopness Client and ensures it is authenticated using
environment-provided credentials.

This module is used by the MCP Server to authenticate as a system user for performing
operations with the Devopness API. It expects the environment variables
`DEVOPNESS_USER_EMAIL` and `DEVOPNESS_USER_PASSWORD` to be set with valid credentials.
"""

import os

from devopness import DevopnessClientAsync
from devopness.client_config import get_user_agent
from devopness.models import (
    UserLogin,
)

devopness = DevopnessClientAsync(
    {
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": get_user_agent(
                product_name="devopness-mcp-server",
                product_package_name="devopness-mcp-server",
            ),
        },
    }
)


async def ensure_authenticated() -> None:
    user_email = os.environ.get("DEVOPNESS_USER_EMAIL")
    user_pass = os.environ.get("DEVOPNESS_USER_PASSWORD")

    if not user_email or not user_pass:
        raise Exception("DEVOPNESS_USER_EMAIL and DEVOPNESS_USER_PASSWORD must be set")

    # TODO: only invoke login if not yet authenticated
    user_data = UserLogin(email=user_email, password=user_pass)
    await devopness.users.login_user(user_data)
