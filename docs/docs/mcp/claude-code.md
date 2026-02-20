---
title: Install Devopness MCP Server on Claude Code
---

This guide walks you through installing and configuring the Devopness MCP server on [Claude Code](https://claude.com/claude-code) by Anthropic.

## Prerequisites

1. An active Devopness account
2. [Claude Code](https://claude.com/claude-code) installed on your machine
   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```

## How Devopness integrates with Claude Code

Devopness provides a remote MCP server that Claude Code connects to. Devopness offers two authentication methods:

- **OAuth 2.0:** Browser-based authentication flow
- **API Token:** Header-based authentication using Personal Access Tokens

Once configured, you'll have access to Devopness tools directly from the Claude Code command line interface.

## Configure the MCP server

### Method 1: OAuth Authentication

**Step 1: Add the MCP server**

```bash
claude mcp add --transport http devopness https://mcp.devopness.com/mcp/
```

This command registers the Devopness MCP server with Claude Code.

**Step 2: Authenticate via browser**

1. Start Claude Code:
   ```bash
   claude
   ```

2. Open the MCP management interface:
   ```
   > /mcp
   ```

3. Select the **devopness** server from the list

4. Choose **Authenticate**

5. Your default browser will open to the Devopness authorization page

6. Review the requested permissions and click **Authorize**

7. The browser will show a success message and you'll be redirected back to Claude Code

8. Verify authentication by running `/mcp` again - you should see:
   ```
   Status: ✔ connected
   Auth: ✔ authenticated
   Tools: Multiple Devopness tools available
   ```

### Method 2: API Token Authentication

**Step 1: Create a Personal Access Token**

Create a Personal Access Token in your Devopness account. See [Add Personal Access Token](/docs/api-tokens/personal-access-tokens/add-personal-access-token) for instructions.

**Step 2: Add the server with authentication header**

```bash
claude mcp add --transport http devopness https://mcp.devopness.com/mcp/ \
  --header "Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN"
```

Replace `YOUR_PERSONAL_ACCESS_TOKEN` with the token you generated in Step 1.


## Activate and verify the connection

1. Start Claude Code if not already running:
   ```bash
   claude
   ```

2. Check the MCP server status:
   ```
   > /mcp
   ```

3. Expected output for a successfully configured server:
   ```
   Server name: devopness
   Status: ✔ connected
   Auth: ✔ authenticated
   Tools: Multiple Devopness tools available
   ```

4. If you see `needs authentication`, select the server and choose **Authenticate** to complete the OAuth flow

## Use the MCP server

Once connected and authenticated, you can use natural language to interact with your Devopness infrastructure. Try these example prompts:

**Project and Environment Management:**
- "List all my Devopness projects"
- "Show the environments in the [project name] project"
- "What servers are running in my production environment?"

**Application Deployment:**
- "Deploy my application to staging"
- "Show recent deployments for [application name]"
- "What's the status of my latest deployment?"

**Server Management:**
- "List all servers in production"
- "Show server details for [server name]"
- "What services are running on [server name]?"

**Infrastructure Monitoring:**
- "Show me the status of all my applications"
- "List all SSL certificates about to expire"
- "What cron jobs are configured in production?"

## Troubleshooting

- **Server shows "needs authentication" status:** Run the `/mcp` command, select the Devopness server, and choose **Authenticate** to complete the OAuth flow.
- **OAuth callback errors or timeout:** Verify you can access `https://mcp.devopness.com` from your browser, check if your firewall is blocking the OAuth callback on localhost, or try specifying a different port with `--callback-port 8081`. Use the **Re-authenticate** option in the `/mcp` menu if needed.
- **API Token authentication errors:** Ensure you're using the complete token with the `Bearer` prefix in the header. Check if your Personal Access Token is still valid in your Devopness account settings.
- **Tools not appearing:** Restart Claude Code (`claude` command), verify authentication status shows `✔ authenticated`, and ensure connection shows `✔ connected`. Try the **Re-authenticate** option or remove and re-add the server via `/mcp` if necessary.
- **Claude Code responds without using Devopness data:** Ensure the MCP server status is `✔ connected` and `✔ authenticated`. Be more specific in your prompts (e.g., "List my Devopness projects" instead of "What projects do I have?"). Verify you have actual resources in your Devopness account.

