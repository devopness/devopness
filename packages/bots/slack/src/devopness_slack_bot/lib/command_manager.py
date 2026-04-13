"""
Command Manager for Devopness Slack Bot

This module discovers and registers Slack commands from command classes.

Each command is defined as a static method with the prefix 'command_' and
is automatically extracted and registered with the Slack app.

The command manager automatically injects an AppContext parameter into all
command handlers, similar to how the MCP server injects ServerContext.

Usage:
    from devopness_slack_bot.lib.command_manager import register_commands

    register_commands(app, context)
"""

from typing import Any, Callable, TypedDict

from devopness_slack_bot.app import App
from devopness_slack_bot.lib.context import AppContext


class Command(TypedDict):
    """Command configuration."""

    name: str  # Command name (e.g., "/auth", "hello")
    handler: Callable  # Command handler function
    command_type: str  # Type: "slash", "message", "action", "view"


COMMAND_PREFIX = "command_"
COMMAND_PREFIX_LEN = len(COMMAND_PREFIX)


def is_command(name: str, member: Any) -> bool:  # noqa: ANN401
    """
    Check if a class member is a command.

    Args:
        name: Member name
        member: Member object

    Returns:
        True if member is a command (starts with 'command_' and is staticmethod)
    """
    return name.startswith(COMMAND_PREFIX) and isinstance(member, staticmethod)


def extract_commands_from_class(command_class: type) -> list[Command]:
    """
    Extract all commands from a command class.

    Commands are static methods prefixed with 'command_' that have metadata
    in their docstring.

    Args:
        command_class: Class containing command methods

    Returns:
        List of command configurations
    """
    commands: list[Command] = []

    for name, member in command_class.__dict__.items():
        if not is_command(name, member):
            continue

        # Extract command name (remove prefix)
        command_name = name[COMMAND_PREFIX_LEN:]

        # Get the function
        func = member.__func__

        # Parse metadata from docstring
        metadata = _parse_command_metadata(func)

        command = Command(
            name=metadata.get("name", command_name),
            handler=func,
            command_type=metadata.get("type", "slash"),
        )

        commands.append(command)

    return commands


def _parse_command_metadata(func: Callable) -> dict[str, str]:
    """
    Parse command metadata from function docstring.

    Expected format:
        '''
        @command: /auth
        @type: slash
        Description of the command
        '''

    Args:
        func: Command handler function

    Returns:
        Dictionary with metadata (name, type, description)
    """
    metadata: dict[str, str] = {}

    if not func.__doc__:
        return metadata

    lines = func.__doc__.strip().split("\n")

    for line in lines:
        line = line.strip()
        if line.startswith("@command:"):
            metadata["name"] = line.split(":", 1)[1].strip()
        elif line.startswith("@type:"):
            metadata["type"] = line.split(":", 1)[1].strip()
        elif line.startswith("@action:"):
            metadata["action"] = line.split(":", 1)[1].strip()
        elif line.startswith("@view:"):
            metadata["view"] = line.split(":", 1)[1].strip()

    return metadata


def register_commands(
    app: App,
    ctx: AppContext,
    command_classes: list[type],
) -> None:
    """
    Register all commands from command classes to the Slack app.

    Args:
        app: Slack AsyncApp instance
        ctx: Application context (environment, app instance, etc.)
        command_classes: List of command classes to register
    """
    all_commands: list[Command] = []

    # Extract commands from all classes
    for command_class in command_classes:
        class_commands = extract_commands_from_class(command_class)
        all_commands.extend(class_commands)

    # Sort commands by name for consistent registration
    all_commands.sort(key=lambda cmd: cmd["name"])

    # Register each command with the appropriate decorator
    for cmd in all_commands:
        command_type = cmd["command_type"]
        name = cmd["name"]
        handler = cmd["handler"]

        # Create wrapper that injects AppContext (use default arg to capture handler)
        def make_wrapper(func: Callable):
            async def wrapped(*args, **kwargs):
                # Inject AppContext into kwargs as 'ctx' parameter
                kwargs["ctx"] = ctx
                return await func(*args, **kwargs)

            return wrapped

        wrapped_handler = make_wrapper(handler)

        # Register based on type
        if command_type == "slash":
            app.command(name)(wrapped_handler)
            print(f"✅ Registered slash command: {name}")

        elif command_type == "message":
            app.message(name)(wrapped_handler)
            print(f"✅ Registered message handler: {name}")

        elif command_type == "action":
            action_id = _parse_command_metadata(handler).get("action", name)
            app.action(action_id)(wrapped_handler)
            print(f"✅ Registered action handler: {action_id}")

        elif command_type == "view":
            view_id = _parse_command_metadata(handler).get("view", name)
            app.view(view_id)(wrapped_handler)
            print(f"✅ Registered view handler: {view_id}")

        else:
            print(f"⚠️  Unknown command type '{command_type}' for: {name}")
