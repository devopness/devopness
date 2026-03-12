---
title: Install Devopness MCP Server on Warp
---

This guide walks you through installing and configuring the Devopness MCP server on [Warp](https://www.warp.dev/).

## Prerequisites

1. [Warp](https://www.warp.dev/) installed on your machine
2. [Node.js](https://nodejs.org/) installed (required for the `npx` command)
3. A Devopness account with a Personal Access Token

## How Devopness integrates with Warp

Warp does not natively support remote HTTP MCP servers with custom headers. The connection is established through `mcp-remote`, a lightweight proxy that bridges Warp to the Devopness remote MCP server.

## Configure the MCP server

1. Open Warp and navigate to **Settings > Personal > MCP Servers**
2. Click **Add Server**, then select **CLI Server**
3. Paste the following configuration, replacing `YOUR_PERSONAL_ACCESS_TOKEN` with your Devopness Personal Access Token:

```json
{
  "mcpServers": {
    "devopness": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.devopness.com/mcp/",
        "--header",
        "Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      ]
    }
  }
}
```

4. Save the configuration

## Activate and verify the connection

1. In the MCP Servers settings page, check the box to auto-start the server on launch, or start it manually
2. Look for **Running** displayed above the MCP server name to confirm the connection is active
3. The Devopness tools should now be available in your Warp AI sessions

## Use the MCP server

In a Warp AI session, try a prompt such as:

- "List my Devopness projects"
- "Show the servers in my production environment"
- "Deploy my application to staging"

## Troubleshooting

- **Server not starting:** Verify that Node.js is installed by running `node --version` in your terminal.
- **Authentication errors:** Verify that your Personal Access Token is correct and has not expired.
- **Check logs:** Click the **log file** link in the MCP server settings for detailed error messages.
- **Cached credentials:** If authentication issues persist after changing your token, try removing cached MCP credentials by running `rm -rf ~/.mcp-auth`.
