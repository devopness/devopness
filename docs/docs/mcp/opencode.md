---
title: Install Devopness MCP Server on OpenCode
---

This guide walks you through installing and configuring the Devopness MCP server on [Opencode](https://opencode.ai/) by Anoma.ly.

## Prerequisites

1. [OpenCode](https://www.opencode.ai/) installed on your machine
2. A Devopness account with a Personal Access Token

## How Devopness integrates with OpenCode

Devopness provides a remote MCP server that OpenCode connects to through its native HTTP support. Once configured, the Devopness tools become available in your OpenCode CLI sessions.

## Installation

### Option A: Edit your OpenCode config file (opencode.json)

1. Open your `opencode.json` config file in your favorite text editor, for Windows users located on the following path: `%USERPROFILE%\.config\opencode\opencode.json`, for Linux and MacOS users located on the following path: `~/.config/opencode/opencode.json`
2. Add the following configuration to your `opencode.json` file:

```json
{
  "mcp": {
    "devopness": {
      "type": "remote",
      "url": "https://mcp.devopness.com/mcp/",
      "oauth": {}
    }
  }
}
```

3. Save the `opencode.json` file
4. Open your terminal and run `opencode mcp auth` and choose the `devopness` option
5. Will open a browser window for you to authenticate with your Devopness account, and upon successful authentication, you will be redirected back to your terminal.
6. Restart your terminal
7. You are now authenticated with your Devopness account and can use the Devopness MCP server with your Opencode CLI sessions.

### Option B: Use the interactive mode `opencode mcp add`

1. Open your terminal and run `opencode mcp add`
2. Follow the interactive prompts to add your Devopness MCP server to your OpenCode config:
  - **Location** choose the location `Global`
  - **Enter MCP server name**  Enter MCP name, we recommend `devopness`
  - **Select MCP server type** Choose `remote`
  - **Enter MCP server URL** Enter MCP URL, use `https://mcp.devopness.com/mcp/`
  - **Does this server require OAuth authentication?** Choose the option `yes`
  - **Do you have a pre-registered client ID?** Choose the option `no`
3. run `opencode mcp auth` and choose the `devopness` option
4. Will open a browser window for you to authenticate with your Devopness account, and upon successful authentication, you will be redirected back to your terminal.
5. Restart your terminal
6. You are now authenticated with your Devopness account and can use the Devopness MCP server with your OpenCode CLI sessions.

:::tip

You can check if your MCP server is configured correctly by running `opencode mcp list`, will show a message like this:

```bash
MCP servers

✔ Devopness connected (OAuth)
    https://mcp.devopness.com/mcp/
```

:::

## Activate and verify the connection

1. Start opencode
2. Run the `/mcp` command to check the server status
3. Type in the popup `devopness`
4. Verify that the Devopness server shows as **devopness connected**

## Use the MCP server

In a OpenCode session, try a prompt such as:

- "List my Devopness projects"
- "Show the servers in my production environment"
- "Deploy my application to staging"

## Troubleshooting

- **Server not connecting:** Ensure the `url` uses the `https://` prefix and the JSON syntax is valid.
- **Authentication errors:** Closes the OpenCode session and run `opencode mcp auth`, and choose the `devopness` option to authenticate again.
- **Wrong credentials:** Run `opencode mcp logout` and choose the `devopness` option to remove your credentials and authenticate again.
