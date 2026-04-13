# Devopness Slack Bot Setup Guide

## Prerequisites

1. **Python 3.12+** installed
2. **uv** package manager installed (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
3. A Slack workspace where you can install apps

## Step 1: Create Your Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"** → **"From scratch"**
3. Name it (e.g., "Devopness DEV")
4. Select your workspace

## Step 2: Configure App Permissions

### OAuth & Permissions

Add these **Bot Token Scopes**:
- `chat:write` - Send messages
- `chat:write.public` - Send messages to channels without joining
- `commands` - Add slash commands
- `users:read` - View people in the workspace
- `im:history` - View messages in direct messages
- `im:write` - Start direct messages

### Event Subscriptions

Enable **Socket Mode** (recommended for local development):
1. Go to **Socket Mode** in the sidebar
2. Enable it (this creates an app-level token)

Subscribe to these **Bot Events**:
- `message.im` - Listen to messages in direct messages

## Step 3: Add Slash Commands

Go to **Slash Commands** and create these:

### `/auth`
- **Command:** `/auth`
- **Request URL:** `https://example.com/slack/commands` (placeholder - not used in Socket Mode)
- **Short Description:** Configure your Devopness API token

### `/whoami`
- **Command:** `/whoami`
- **Request URL:** `https://example.com/slack/commands` (placeholder)
- **Short Description:** Check your authentication status

## Step 4: Install the App

1. Go to **Install App** in the sidebar
2. Click **"Install to Workspace"**
3. Click **"Allow"**

## Step 5: Get Your Tokens

### Bot Token (starts with `xoxb-`)
1. Go to **OAuth & Permissions**
2. Copy the **Bot User OAuth Token**

### App-Level Token (starts with `xapp-`)
1. Go to **Basic Information**
2. Scroll to **App-Level Tokens**
3. Click **"Generate Token and Scopes"**
4. Name it (e.g., "socket-mode")
5. Add scope: `connections:write`
6. Copy the token

## Step 6: Generate Encryption Key

The bot encrypts user tokens before storing them. Generate an encryption key:

```bash
cd packages/bots/slack
uv run python generate_key.py
```

This will output something like:
```
DEVOPNESS_ENCRYPTION_KEY=VMQtF8P1a_mw2aFCbFjFPbyWtMJLO5InaMdVeAUsCxo=
```

**⚠️ IMPORTANT:**
- Keep this key SECRET
- Store it securely (1Password, AWS Secrets Manager, etc.)
- If you lose it, all encrypted tokens are unrecoverable
- Do NOT commit this to git

## Step 7: Configure Environment Variables

Create a `.env` file in `packages/bots/slack/`:

```bash
# Slack Tokens
DEVOPNESS_SLACK_BOT_TOKEN=xoxb-your-bot-token-here
DEVOPNESS_SLACK_APP_TOKEN=xapp-your-app-token-here

# Encryption Key (generate with: python generate_key.py)
DEVOPNESS_ENCRYPTION_KEY=your-generated-key-here

# Optional: Override Devopness API URL (default: https://api.devopness.com)
# DEVOPNESS_API_URL=https://api.devopness.com
```

Or copy the example file:
```bash
cp .env.example .env
# Then edit .env with your actual values
```

## Step 7: Install Dependencies

```bash
cd packages/bots/slack
uv sync
```

## Step 8: Run the Bot

```bash
uv run bot
```

You should see:
```
⚡️ Bolt app is running!
```

## Using the Bot

### Authenticate

1. Open a DM with the bot in Slack
2. Type `/auth` and press Enter
3. A modal will appear - enter your Devopness API token
4. Click **"Submit"**
5. You'll see: ✅ Your Devopness API token has been saved securely!

### Check Authentication

Type `/whoami` to verify you're authenticated. You'll see:
```
✅ Authenticated as: Your Name (your@email.com)
```

### Get Devopness API Token

1. Log in to [app.devopness.com](https://app.devopness.com)
2. Go to **Settings** → **API Tokens**
3. Click **"Create New Token"**
4. Copy the token and use it in `/auth`

## Architecture

### Database
- **Location:** `packages/bots/slack/data/bot.db` (SQLite)
- **ORM:** Tortoise ORM
- **Models:** `UserCredential` - stores encrypted user tokens

### Authentication Flow
1. User runs `/auth` → Modal opens
2. User enters token → Saved to database (base64 encoded)
3. User runs any command → Bot retrieves token from DB
4. Bot authenticates with Devopness API → Executes command

### Security Notes
- Tokens are stored base64-encoded in SQLite
- Database is excluded from git (see `.gitignore`)
- Each user's token is isolated by their Slack user ID
- Consider adding encryption at rest for production use

## Troubleshooting

### Command not found (`/auth` or `/whoami`)
- Make sure you registered the slash commands in your Slack App configuration
- After adding commands, reinstall the app to your workspace

### "No TortoiseContext is currently active"
- This has been fixed - the bot now uses a background event loop for database operations

### Authentication fails
- Check your Devopness API token is valid
- Verify `DEVOPNESS_API_URL` points to the correct environment

## Development Commands

```bash
# Run bot
uv run bot

# Run with auto-reload (requires watchdog)
uv run --with watchdog watchmedo auto-restart --patterns="*.py" --recursive -- uv run bot

# Run linter
uv run ruff check .

# Format code
uv run ruff format .

# Type check
uv run mypy src/
```

## Next Steps

- [ ] Add more slash commands (e.g., `/deploy`, `/servers`)
- [ ] Add encryption for stored tokens
- [ ] Add user onboarding flow
- [ ] Add help command
- [ ] Add interactive components (buttons, menus)
