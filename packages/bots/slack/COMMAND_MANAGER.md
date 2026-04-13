# Command Manager System

The Slack bot uses a **command discovery and registration system** inspired by the MCP server's tool management pattern. Commands are automatically discovered from command classes and registered with the Slack app.

## Overview

Instead of defining commands inline in `main.py`, commands are organized into **command classes** with static methods prefixed with `command_`. The command manager automatically:

1. ✅ Discovers command methods from command classes
2. ✅ Parses metadata from docstrings
3. ✅ Injects environment variables
4. ✅ Registers commands with the appropriate Slack handlers

## Benefits

- **Organization**: Commands are grouped by domain (auth, deployment, monitoring, etc.)
- **Discoverability**: New commands are automatically registered
- **Consistency**: Enforces a standard pattern for all commands
- **Environment Injection**: Automatically provides `environment` to all handlers
- **Separation of Concerns**: Command logic separated from app initialization

## How It Works

### 1. Command Class Structure

```python
from devopness_slack_bot.lib.context import AppContext

class YourCommands:
    """Description of command group."""

    @staticmethod
    async def command_your_command(
        ack,
        body,
        client,
        ctx: AppContext,
    ) -> None:
        """
        @command: /your-command
        @type: slash

        Description of what the command does.
        """
        await ack()
        # Access environment via ctx
        api_url = ctx.environment.DEVOPNESS_API_URL
        # Your command logic here
```

**Note:** All command handlers receive an `AppContext` parameter (`ctx`) that provides access to:
- `ctx.environment` - Environment variables and configuration
- Future: `ctx.app`, `ctx.logger`, `ctx.cache`, etc.

### 2. Metadata Format

Commands use **docstring metadata** to configure registration:

```python
"""
@command: /deploy          # Command name (slash, message text, etc.)
@type: slash              # Handler type: slash, message, action, view
@action: button_id        # (Optional) For action handlers
@view: modal_id           # (Optional) For view handlers

Human-readable description of the command.
"""
```

### 3. Handler Types

| Type | Usage | Example |
|------|-------|---------|
| `slash` | Slash commands (`/auth`) | `/whoami` - Check authentication |
| `message` | Text message matching | `hello` - Respond to "hello" |
| `action` | Button/select interactions | `button_click` - Handle button clicks |
| `view` | Modal submissions | `token_submission` - Handle modal submit |

## Creating New Commands

### Step 1: Create a Command Class

Create a new file in `src/devopness_slack_bot/commands/`:

```python
# src/devopness_slack_bot/commands/server_commands.py

from devopness_slack_bot.lib.credentials import get_user_credentials
from devopness_slack_bot.lib.devopness_api import (
    ensure_authenticated,
    get_devopness_client,
)
from devopness_slack_bot.lib.environment import EnvironmentVariables


class ServerCommands:
    """Commands for managing servers."""

    @staticmethod
    async def command_servers(
        ack,
        body,
        client,
        environment: EnvironmentVariables,
    ) -> None:
        """
        @command: /servers
        @type: slash

        List all servers in your Devopness account.
        """
        await ack()
        user_id = body["user_id"]

        # Get user credentials
        credentials = await get_user_credentials(
            user_id,
            encryption_key=environment.DEVOPNESS_ENCRYPTION_KEY,
        )

        if not credentials:
            await client.chat_postEphemeral(
                channel=body["channel_id"],
                user=user_id,
                text="❌ Not authenticated. Use `/auth` first.",
            )
            return

        # Authenticate and fetch servers
        ensure_authenticated(credentials)
        devopness_client = get_devopness_client(environment)

        try:
            response = await devopness_client.servers.list_servers()
            servers = response.data

            if not servers:
                message = "No servers found."
            else:
                server_list = "\n".join([f"• *{s.name}* ({s.ip})" for s in servers])
                message = f"*Your Servers ({len(servers)}):*\n{server_list}"

            await client.chat_postEphemeral(
                channel=body["channel_id"],
                user=user_id,
                text=message,
            )
        except Exception as e:
            await client.chat_postEphemeral(
                channel=body["channel_id"],
                user=user_id,
                text=f"❌ Error fetching servers: {e!s}",
            )
```

### Step 2: Register the Command Class

Update `src/devopness_slack_bot/commands/__init__.py`:

```python
from .auth_commands import AuthCommands
from .example_commands import ExampleCommands
from .server_commands import ServerCommands  # Add this

__all__ = [
    "AuthCommands",
    "ExampleCommands",
    "ServerCommands",  # Add this
]
```

### Step 3: Add to main.py

Update `src/devopness_slack_bot/main.py`:

```python
from devopness_slack_bot.commands import (
    AuthCommands,
    ExampleCommands,
    ServerCommands,  # Import
)

# ...

register_commands(
    app=app,
    environment=environment,
    command_classes=[
        AuthCommands,
        ExampleCommands,
        ServerCommands,  # Add to list
    ],
)
```

### Step 4: Register in Slack

Don't forget to register new slash commands in your Slack App dashboard!

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Select your app → **Slash Commands**
3. Click **Create New Command**
4. Command: `/servers`
5. Save and reinstall the app

## Command Examples

### Slash Command

```python
@staticmethod
async def command_deploy(
    ack,
    body,
    client,
    environment: EnvironmentVariables,
) -> None:
    """
    @command: /deploy
    @type: slash

    Deploy an application.
    """
    await ack()
    # Implementation...
```

### Message Handler

```python
@staticmethod
async def command_hello(
    message,
    say,
    environment: EnvironmentVariables,
) -> None:
    """
    @command: hello
    @type: message

    Respond to hello messages.
    """
    await say(f"Hi <@{message['user']}>!")
```

### Action Handler (Button Click)

```python
@staticmethod
async def command_deploy_button(
    body,
    ack,
    client,
    environment: EnvironmentVariables,
) -> None:
    """
    @command: deploy_button
    @type: action
    @action: deploy_button

    Handle deploy button clicks.
    """
    await ack()
    # Implementation...
```

### View Handler (Modal Submission)

```python
@staticmethod
async def command_deploy_modal(
    ack,
    body,
    view,
    client,
    environment: EnvironmentVariables,
) -> None:
    """
    @command: deploy_modal_submission
    @type: view
    @view: deploy_modal

    Handle deploy modal submission.
    """
    await ack()
    app_name = view["state"]["values"]["app_block"]["app_input"]["value"]
    # Implementation...
```

## Implementation Details

### Command Discovery

The `extract_commands_from_class()` function scans command classes for static methods starting with `command_`:

```python
def is_command(name: str, member: Any) -> bool:
    return name.startswith(COMMAND_PREFIX) and isinstance(member, staticmethod)
```

### Metadata Parsing

Docstrings are parsed to extract metadata:

```python
def _parse_command_metadata(func: Callable) -> dict[str, str]:
    metadata: dict[str, str] = {}
    for line in func.__doc__.split("\n"):
        if line.strip().startswith("@command:"):
            metadata["name"] = line.split(":", 1)[1].strip()
        # ... etc
    return metadata
```

### Environment Injection

A wrapper function injects the `environment` parameter:

```python
def make_wrapper(func: Callable):
    async def wrapped(*args, **kwargs):
        return await func(*args, environment=environment, **kwargs)
    return wrapped
```

### Registration

Commands are registered with the appropriate Slack decorator:

```python
if command_type == "slash":
    app.command(name)(wrapped_handler)
elif command_type == "message":
    app.message(name)(wrapped_handler)
# ... etc
```

## Best Practices

### ✅ DO

- **Group related commands** in the same class (`AuthCommands`, `ServerCommands`)
- **Document with docstrings** including metadata and description
- **Check authentication** before calling Devopness API
- **Handle errors gracefully** with user-friendly messages
- **Use ephemeral messages** for user-specific responses
- **Acknowledge immediately** with `await ack()`

### ❌ DON'T

- **Don't mix concerns** - keep commands focused on one task
- **Don't skip authentication checks** - always verify user has valid token
- **Don't forget to register** slash commands in Slack App dashboard
- **Don't block** - use async/await for all I/O operations
- **Don't expose sensitive data** in public channels

## File Structure

```
src/devopness_slack_bot/
├── main.py                       # App initialization, command registration
├── commands/                     # Command classes
│   ├── __init__.py              # Command exports
│   ├── auth_commands.py         # /auth, /whoami
│   ├── example_commands.py      # hello, button_click
│   └── server_commands.py       # /servers (example)
└── lib/
    └── command_manager.py       # Command discovery & registration
```

## Testing Commands

### Manual Testing

1. Start the bot: `uv run bot`
2. Send commands in Slack
3. Check bot logs for errors

### Automated Testing

Create unit tests for command logic:

```python
import pytest
from devopness_slack_bot.commands import ServerCommands

@pytest.mark.asyncio
async def test_servers_command():
    # Mock dependencies
    ack = AsyncMock()
    body = {"user_id": "U123", "channel_id": "C123"}
    client = AsyncMock()
    environment = Mock(DEVOPNESS_ENCRYPTION_KEY="test_key")

    # Call command
    await ServerCommands.command_servers(ack, body, client, environment)

    # Assert
    ack.assert_called_once()
    # ... more assertions
```

## Debugging

### Command Not Found

**Symptom**: Slack says "command not found"

**Cause**: Command not registered in Slack App dashboard

**Solution**: Register the command in [api.slack.com/apps](https://api.slack.com/apps)

### Handler Not Called

**Symptom**: Command does nothing

**Cause**: 
- Method name doesn't start with `command_`
- Missing `@staticmethod` decorator
- Command class not added to `register_commands()`

**Solution**: Check method prefix, decorator, and registration

### Environment Variable Error

**Symptom**: `'EnvironmentVariables' object has no attribute ...`

**Cause**: Missing environment variable

**Solution**: Add to `.env` file

## Advanced Patterns

### Command with Parameters

Use modal or message parsing to get parameters:

```python
@staticmethod
async def command_deploy(ack, body, client, environment: EnvironmentVariables) -> None:
    """@command: /deploy
    @type: slash
    
    Deploy an application with interactive modal.
    """
    await ack()
    # Open modal to collect parameters
    await client.views_open(
        trigger_id=body["trigger_id"],
        view={ /* modal definition */ }
    )
```

### Middleware Pattern

Add common logic (auth check, logging) in a base handler:

```python
async def authenticated_command(func):
    """Decorator for commands requiring authentication."""
    async def wrapper(ack, body, client, environment, **kwargs):
        user_id = body.get("user_id") or body["user"]["id"]
        credentials = await get_user_credentials(user_id, environment.DEVOPNESS_ENCRYPTION_KEY)
        
        if not credentials:
            await client.chat_postEphemeral(
                channel=body["channel_id"],
                user=user_id,
                text="❌ Not authenticated. Use `/auth` first."
            )
            return
        
        return await func(ack, body, client, environment, credentials=credentials, **kwargs)
    return wrapper
```

## References

- [Slack Bolt for Python Docs](https://slack.dev/bolt-python/)
- [MCP Server Tool System](../../devopness-ai/mcp-server/src/devopness_mcp_server/lib/tools.py)
- [Command Manager Source](src/devopness_slack_bot/lib/command_manager.py)

## Questions?

Open an issue on GitHub: https://github.com/devopness/devopness/issues
