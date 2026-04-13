from slack_bolt.async_app import AsyncApp as _AsyncApp
from slack_bolt.adapter.socket_mode.async_handler import AsyncSocketModeHandler

from devopness_slack_bot.lib.environment import EnvironmentVariables


class App(_AsyncApp):
    env: EnvironmentVariables

    def __init__(self, env: EnvironmentVariables) -> None:
        self.env = env

        super().__init__(
            token=self.env.DEVOPNESS_SLACK_BOT_TOKEN,
        )

    async def run(self) -> None:
        handler = AsyncSocketModeHandler(self, self.env.DEVOPNESS_SLACK_APP_TOKEN)
        await handler.start_async()
