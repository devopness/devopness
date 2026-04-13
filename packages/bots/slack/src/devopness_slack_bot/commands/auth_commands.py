"""Authentication-related commands for the Slack bot."""

from slack_sdk.models.blocks import InputBlock, PlainTextInputElement
from slack_sdk.models.views import View

from devopness_slack_bot.lib.context import AppContext
from devopness_slack_bot.lib.credentials import get_user_credentials, save_user_token
from devopness_slack_bot.lib.devopness_api import (
    ensure_authenticated,
    get_devopness_client,
)


class AuthCommands:
    """Commands for managing user authentication with Devopness API."""

    @staticmethod
    async def command_auth(ack, body, client, ctx: AppContext) -> None:
        """
        @command: /auth
        @type: slash

        Open a modal for users to configure their Devopness API token.
        """
        await ack()
        await client.views_open(
            trigger_id=body["trigger_id"],
            view=View(
                type="modal",
                callback_id="token_submission",
                title="Configure Token",
                submit="Submit",
                blocks=[
                    InputBlock(
                        block_id="token_block",
                        label="API Token",
                        element=PlainTextInputElement(
                            action_id="token_input",
                            placeholder="Enter your Devopness API token",
                            multiline=False,
                        ),
                    )
                ],
            ),
        )

    @staticmethod
    async def command_token_submission(
        ack,
        body,
        view,
        client,
        ctx: AppContext,
    ) -> None:
        """
        @command: token_submission
        @type: view
        @view: token_submission

        Handle the token submission from the /auth modal.
        """
        token = view["state"]["values"]["token_block"]["token_input"]["value"]
        user_id = body["user"]["id"]

        # Acknowledge immediately to close the modal
        await ack()

        # Save token to database (encrypted)
        try:
            await save_user_token(
                slack_user_id=user_id,
                token=token,
                encryption_key=ctx.environment.DEVOPNESS_ENCRYPTION_KEY,
                token_type="api_token",  # noqa: S106
            )
            # Send success message
            await client.chat_postEphemeral(
                channel=user_id,
                user=user_id,
                text="✅ Your Devopness API token has been saved securely (encrypted)!",
            )
        except Exception as e:
            # Send error message
            await client.chat_postEphemeral(
                channel=user_id,
                user=user_id,
                text=f"❌ Failed to save token: {e!s}",
            )

    @staticmethod
    async def command_whoami(
        ack,
        body,
        client,
        ctx: AppContext,
    ) -> None:
        """
        @command: /whoami
        @type: slash

        Check authentication status and display the user's Devopness profile.
        """
        await ack()
        user_id = body["user_id"]

        # Check authentication status
        try:
            credentials = await get_user_credentials(
                user_id,
                encryption_key=ctx.environment.DEVOPNESS_ENCRYPTION_KEY,
            )
            if credentials:
                # Try to authenticate and get user info
                ensure_authenticated(credentials)
                devopness_client = get_devopness_client(ctx.environment)

                try:
                    profile = await devopness_client.users.get_user_me()
                    await client.chat_postEphemeral(
                        channel=body["channel_id"],
                        user=user_id,
                        text=f"✅ Authenticated as: *{profile.data.name}* ({profile.data.email})",
                    )
                except Exception:
                    await client.chat_postEphemeral(
                        channel=body["channel_id"],
                        user=user_id,
                        text=(
                            "⚠️ Token found but authentication failed. "
                            "Please update your token using `/auth`"
                        ),
                    )
            else:
                await client.chat_postEphemeral(
                    channel=body["channel_id"],
                    user=user_id,
                    text="❌ Not authenticated. Use `/auth` to configure your API token.",
                )
        except Exception as e:
            await client.chat_postEphemeral(
                channel=body["channel_id"],
                user=user_id,
                text=f"❌ Error checking authentication: {e!s}",
            )
