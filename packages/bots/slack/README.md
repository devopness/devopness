# Devopness Slack Bot

A fully async Slack bot for managing Devopness infrastructure directly from Slack.

## Features

✅ **Secure Authentication** - Store Devopness API tokens with Fernet encryption
✅ **Async Architecture** - Built on `slack_bolt.async_app` for optimal performance
✅ **Database Persistence** - SQLite with Tortoise ORM
✅ **User-Friendly Commands** - Slash commands with interactive modals

## Available Commands

- `/auth` - Configure your Devopness API token (opens a secure modal)
- `/whoami` - Check authentication status and view your profile
- `hello` - Simple greeting (direct message to the bot)

## Quick Start

### 1. Prerequisites

- Python 3.12+
- `uv` package manager
- A Slack workspace with admin access

### 2. Install Dependencies

```bash
cd packages/bots/slack
uv sync
```

### 3. Generate Encryption Key

```bash
uv run python generate_key.py
```

Copy the generated key for the next step.

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your tokens and encryption key
```

### 5. Set Up Slack App

Follow the detailed setup guide in [SETUP.md](./SETUP.md)

### 6. Run the Bot

```bash
uv run bot
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Slack User                          │
└────────────────────┬────────────────────────────────────┘
                     │ /auth, /whoami
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Slack Bot (AsyncApp)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Async Handlers (commands, actions, messages)   │   │
│  └──────────────────┬──────────────────────────────┘   │
└─────────────────────┼────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
┌──────────────────┐     ┌────────────────────┐
│  SQLite Database │     │  Devopness API     │
│  (Encrypted)     │     │  (Async Client)    │
└──────────────────┘     └────────────────────┘
```

## Security

### Token Encryption

All user tokens are encrypted using **Fernet (symmetric encryption)**:

1. User enters token → Base64 encode → Encrypt → Store in SQLite
2. Retrieval: Fetch from DB → Decrypt → Base64 encoded token → Use with API

### Key Management

- **Generation**: `python generate_key.py`
- **Storage**: Environment variable `DEVOPNESS_ENCRYPTION_KEY`
- **Critical**: If you lose the key, all encrypted tokens are unrecoverable

### Best Practices

- ✅ Use environment variables (`.env` file)
- ✅ Never commit encryption keys to git
- ✅ Store keys in a secrets manager (AWS Secrets Manager, 1Password, etc.)
- ✅ Rotate keys periodically (requires re-authentication of all users)

## Development

### Project Structure

```
packages/bots/slack/
├── src/devopness_slack_bot/
│   ├── main.py              # Entry point, command handlers
│   ├── app.py               # Async Slack app wrapper
│   ├── models.py            # Tortoise ORM models
│   └── lib/
│       ├── credentials.py   # Token encryption/decryption
│       ├── database.py      # Database initialization
│       ├── devopness_api.py # Devopness client setup
│       └── environment.py   # Environment variables
├── generate_key.py          # Encryption key generator
├── test_db.py              # Database & encryption tests
├── pyproject.toml          # Dependencies & configuration
├── .env.example            # Example environment config
└── data/                   # SQLite database (gitignored)
```

### Running Tests

```bash
# Test database and encryption
uv run python test_db.py

# Lint code
uv run ruff check src/

# Format code
uv run ruff format src/
```

### Adding New Commands

```python
@app.command("/your-command")
async def command_your_command(ack, body, client) -> None:
    await ack()  # Always acknowledge first
    
    user_id = body["user_id"]
    
    # Get user's credentials
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
    
    # Use credentials with Devopness API
    ensure_authenticated(credentials)
    devopness_client = get_devopness_client(environment)
    
    # Your logic here...
    result = await devopness_client.servers.list_servers()
    
    # Send response
    await client.chat_postEphemeral(
        channel=body["channel_id"],
        user=user_id,
        text=f"Found {len(result.data)} servers!",
    )
```

Don't forget to register new slash commands in your Slack App dashboard!

## Documentation

- 📚 [SETUP.md](./SETUP.md) - Detailed setup instructions
- 📝 [CHANGES.md](./CHANGES.md) - Migration notes and recent changes
- 🔐 [.env.example](./.env.example) - Environment configuration template

## Troubleshooting

### "No module named 'aiohttp'"

```bash
uv sync
```

### "No TortoiseContext is currently active"

This has been fixed! Make sure you're running the latest version.

### Slash commands not working

1. Register commands in [Slack App Dashboard](https://api.slack.com/apps)
2. Go to **Slash Commands** → **Create New Command**
3. Reinstall the app after adding commands

### "Failed to save token: encryption error"

1. Check that `DEVOPNESS_ENCRYPTION_KEY` is set in `.env`
2. Generate a new key: `uv run python generate_key.py`
3. If you changed keys, users need to re-authenticate with `/auth`

## Contributing

When contributing:

1. Follow async/await patterns (all handlers must be `async def`)
2. Use type hints for all function parameters
3. Run linter before committing: `uv run ruff check src/`
4. Add tests for new features
5. Update documentation

## License

MIT License - See main repository for details

## Support

- 🐛 [Report Issues](https://github.com/devopness/devopness/issues)
- 📖 [Devopness Documentation](https://docs.devopness.com)
- 💬 [Slack Support](https://devopness.com/slack)
