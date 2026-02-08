---
title: Install Devopness MCP Server on AntiGravity
---

This guide walks you through installing and configuring the Devopness MCP server on [AntiGravity](https://antigravity.google/) by Google.

## Prerequisites

1. [AntiGravity](https://antigravity.google/) installed on your machine
2. A Devopness account with a Personal Access Token

## How Devopness integrates with AntiGravity

Devopness provides a remote MCP server that AntiGravity connects to through its native HTTP support. Once configured, the Devopness tools become available in the AntiGravity agent panel.

## Configure the MCP server

1. Open the AntiGravity agent panel
2. Click the **"..."** dropdown at the top of the editor panel
3. Select **MCP Servers** to open the MCP Store
4. Click **Manage MCP Servers**, then select **View raw config**
5. This opens the configuration file located at:
    - **macOS/Linux:** `~/.gemini/antigravity/mcp_config.json`
    - **Windows:** `C:\Users\<USERNAME>\.gemini\antigravity\mcp_config.json`

6. Add the following configuration, replacing `YOUR_PERSONAL_ACCESS_TOKEN` with your Devopness Personal Access Token:

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

7. Save the file. AntiGravity automatically reloads the configuration.

## Activate and verify the connection

1. Open the **MCP Servers** panel from the **"..."** dropdown
2. Check the status indicator next to the Devopness server
3. Verify that the Devopness tools are listed and available

## Use the MCP server

In the AntiGravity agent panel, try a prompt such as:

- "List my Devopness projects"
- "Show the servers in my production environment"
- "Deploy my application to staging"

## Troubleshooting

- **Server not appearing:** Verify that the JSON syntax in `mcp_config.json` is valid. Save and reopen the MCP Servers panel.
- **Authentication errors:** Verify that your Personal Access Token is correct and has not expired.
- **Tool limit:** For optimal performance, keep the total number of enabled MCP tools under 50.
- **Alternative configuration:** If the native `serverUrl` approach has issues, try using the `mcp-remote` proxy instead. This requires [Node.js](https://nodejs.org/) to be installed:

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
