---
title: Install Devopness MCP Server on Windsurf
---

This guide walks you through installing and configuring the Devopness MCP server on [Windsurf](https://windsurf.com/) by Codeium.

## Prerequisites

1. [Windsurf](https://windsurf.com/) installed on your machine
2. A Devopness account with a Personal Access Token

## How Devopness integrates with Windsurf

Devopness provides a remote MCP server that Windsurf connects to through its native HTTP support. Once configured, the Devopness tools become available in the Cascade AI assistant panel.

## Configure the MCP server

1. Open the MCP configuration file at:
    - **macOS/Linux:** `~/.codeium/windsurf/mcp_config.json`
    - **Windows:** `%USERPROFILE%\.codeium\windsurf\mcp_config.json`

    :::tip

    You can also access this file from Windsurf by clicking the **MCP icon** in the top-right of the Cascade panel, then selecting **View raw config (JSON)**.

    :::

2. Add the following configuration, replacing `YOUR_PERSONAL_ACCESS_TOKEN` with your Devopness Personal Access Token:

```json
{
  "mcpServers": {
    "devopness": {
      "serverUrl": "https://mcp.devopness.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

3. Save the file

## Activate and verify the connection

1. Open Windsurf and navigate to **Windsurf Settings > Cascade > MCP Servers**
2. Click the **refresh button** to reload the MCP server configuration
3. Confirm that the **devopness** server appears in the list
4. Verify that the Devopness tools are listed under the server entry

## Use the MCP server

Open the Cascade panel and try a prompt such as:

- "List my Devopness projects"
- "Show the servers in my production environment"
- "Deploy my application to staging"

## Troubleshooting

- **Server not appearing:** Check that the JSON syntax in `mcp_config.json` is valid. A missing comma or bracket can prevent the server from loading.
- **Authentication errors:** Verify that your Personal Access Token is correct and has not expired.
- **Check logs:** Review the Windsurf logs at `~/.codeium/windsurf/logs` for detailed error messages.
- **Tool limit:** Windsurf has a limit of 100 total MCP tools. If you have many MCP servers configured, disable tools you do not need.
