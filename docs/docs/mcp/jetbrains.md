---
title: Install Devopness MCP Server on JetBrains AI
---

This guide walks you through installing and configuring the Devopness MCP server on [JetBrains IDEs](https://www.jetbrains.com/) (IntelliJ IDEA, WebStorm, PyCharm, and others) using the AI Assistant plugin.

## Prerequisites

1. A JetBrains IDE version **2025.1** or later (IntelliJ IDEA, WebStorm, PyCharm, etc.)
2. The [AI Assistant](https://plugins.jetbrains.com/plugin/22282-ai-assistant) plugin installed and activated
3. A Devopness account with a Personal Access Token

## How Devopness integrates with JetBrains

Devopness provides a remote MCP server that JetBrains IDEs connect to through the AI Assistant plugin. Once configured, the Devopness tools become available in the AI chat when using Codebase mode.

## Configure the MCP server

1. Open your JetBrains IDE and navigate to **Settings > Tools > AI Assistant > Model Context Protocol (MCP)**
2. Click the **Add (+)** button and select **As JSON** from the dropdown
3. Paste the following configuration, replacing `YOUR_PERSONAL_ACCESS_TOKEN` with your Devopness Personal Access Token:

```json
{
  "mcpServers": {
    "devopness": {
      "url": "https://mcp.devopness.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

4. Click **OK**, then **Apply** to save the configuration

## Activate and verify the connection

1. In the **MCP** settings table, check the **Status** column next to the Devopness server
2. A connected status indicates the server is running
3. Click the status icon to view the list of available Devopness tools
4. In the AI chat, ensure **Codebase mode** is toggled on, as MCP tools are only available in this mode

## Use the MCP server

Open the AI chat in Codebase mode and try a prompt such as:

- "List my Devopness projects"
- "Show the servers in my production environment"
- "Deploy my application to staging"

## Troubleshooting

- **Server not connecting:** Click the **Reconnect** button in the MCP settings if the connection drops.
- **Authentication errors:** Verify that your Personal Access Token is correct and has not expired.
- **Check logs:** Go to **Help > Show Log in Explorer/Finder** and look in the `mcp` folder within the logs directory.
- **MCP tools not appearing in chat:** Make sure **Codebase mode** is enabled in the AI chat. MCP tools are not available in the default chat mode.
- **Plugin version:** Ensure the AI Assistant plugin is version **251.26094.80.5** or later.
