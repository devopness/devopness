---
title: Install Devopness MCP Server on Gemini CLI
---

This guide walks you through installing and configuring the Devopness MCP server on [Gemini CLI](https://github.com/google-gemini/gemini-cli) by Google.

## Prerequisites

1. [Gemini CLI](https://github.com/google-gemini/gemini-cli) installed on your machine
2. A Devopness account with a Personal Access Token

## How Devopness integrates with Gemini CLI

Devopness provides a remote MCP server that Gemini CLI connects to through its native HTTP support. Once configured, the Devopness tools become available in your Gemini CLI sessions.

## Configure the MCP server

### Option A: Edit the settings file

1. Open the Gemini CLI settings file at `~/.gemini/settings.json`
2. Add the following configuration, replacing `YOUR_PERSONAL_ACCESS_TOKEN` with your Devopness Personal Access Token:

```json
{
  "mcpServers": {
    "devopness": {
      "httpUrl": "https://mcp.devopness.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

3. Save the file

:::tip

You can also create a project-level configuration by placing a `.gemini/settings.json` file in your project root directory.

:::

### Option B: Use the CLI command

Run the following command, replacing `YOUR_PERSONAL_ACCESS_TOKEN` with your Devopness Personal Access Token:

```bash
gemini mcp add \
  --transport http \
  --header "Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN" \
  -s user \
  devopness \
  https://mcp.devopness.com/mcp/
```

## Activate and verify the connection

1. Start or restart Gemini CLI
2. Run the `/mcp` command to check the server status
3. The output displays all configured servers with their connection state: **CONNECTED**, **CONNECTING**, or **DISCONNECTED**
4. Verify that the Devopness server shows as **CONNECTED** and its tools are listed

## Use the MCP server

In a Gemini CLI session, try a prompt such as:

- "List my Devopness projects"
- "Show the servers in my production environment"
- "Deploy my application to staging"

## Troubleshooting

- **Server not connecting:** Test the MCP server endpoint independently with `curl https://mcp.devopness.com/mcp/` to verify connectivity.
- **Authentication errors:** Verify that your Personal Access Token is correct and has not expired.
- **Debug mode:** Run Gemini CLI with `--debug` for verbose output, or press **F12** to open the debug console in interactive mode.
- **Configuration priority:** When both `httpUrl` and `url` are set, `httpUrl` takes priority. Use `httpUrl` for the Devopness MCP server.
