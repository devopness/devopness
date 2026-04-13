"""Example commands for demonstration purposes."""

from devopness_slack_bot.lib.context import AppContext


class ExampleCommands:
    """Example commands showing different interaction patterns."""

    @staticmethod
    async def command_hello(message, say, ctx: AppContext) -> None:
        """
        @command: hello
        @type: message

        Respond to "hello" messages with a greeting and interactive button.
        """
        print("Received message: ", message)

        # say() sends a message to the channel where the event was triggered
        await say(
            blocks=[
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"Hey there <@{message['user']}>!",
                    },
                    "accessory": {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "Click Me"},
                        "action_id": "button_click",
                    },
                }
            ],
            text=f"Hey there <@{message['user']}>!",
        )

    @staticmethod
    async def command_button_click(
        body,
        ack,
        say,
        ctx: AppContext,
    ) -> None:
        """
        @command: button_click
        @type: action
        @action: button_click

        Handle clicks on the "Click Me" button from the hello command.
        """
        # Acknowledge the action
        await ack()
        await say(f"<@{body['user']['id']}> clicked the button")
