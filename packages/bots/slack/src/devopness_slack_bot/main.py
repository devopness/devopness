import argparse
import asyncio

from devopness_slack_bot.app import App
from devopness_slack_bot.commands import AuthCommands, ExampleCommands
from devopness_slack_bot.lib.command_manager import register_commands
from devopness_slack_bot.lib.context import AppContext
from devopness_slack_bot.lib.database import close_database, init_database
from devopness_slack_bot.lib.environment import load_environment_variables


async def main() -> None:
    args = argparse.Namespace()

    environment = load_environment_variables(args)
    app = App(environment)

    # Initialize database on startup
    await init_database()

    # Create application context (like ServerContext in MCP server)
    ctx = AppContext(environment=environment)

    # Register all commands from command classes
    print("\n🤖 Registering Slack bot commands...")
    register_commands(
        app=app,
        ctx=ctx,
        command_classes=[
            AuthCommands,
            ExampleCommands,
        ],
    )
    print("✅ All commands registered!\n")

    try:
        await app.run()
    finally:
        # Clean up database connections on shutdown
        await close_database()


def run() -> None:
    """Entry point for the bot command."""
    asyncio.run(main())


if __name__ == "__main__":
    run()
