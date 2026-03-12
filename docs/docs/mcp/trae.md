---
title: Install Devopness MCP Server on Trae
---

This guide walks you through installing and configuring the Devopness MCP server on [Trae](https://www.trae.ai/) by ByteDance.

## Prerequisites

1. [Trae](https://www.trae.ai/) installed on your machine
2. A Devopness account with a Personal Access Token

## How Devopness integrates with Trae

Devopness provides a remote MCP server that Trae connects to through its native HTTP support. Once configured, the Devopness tools become available in the Trae AI assistant.

## Configure the MCP server

1. Click the **Settings** button in the upper-right corner of Trae
2. Navigate to the **MCP** section under Agent settings
3. Click **Add MCP Server**, then select **Manual Configuration**
4. Paste the following configuration, replacing `YOUR_PERSONAL_ACCESS_TOKEN` with your Devopness Personal Access Token:

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

5. Save the configuration

:::tip

You can also configure MCP servers at the project level by creating a `.trae/mcp.json` file in your project root directory. This requires enabling **Settings > Beta > Enable Project MCP** first.

:::

## Activate and verify the connection

1. After saving, the Devopness server should appear in your MCP server list
2. Verify that the status indicator shows the server is active
3. The Devopness tools should now be available in your Trae AI sessions

## Use the MCP server

Open a Trae AI session and try a prompt such as:

- "List my Devopness projects"
- "Show the servers in my production environment"
- "Deploy my application to staging"

## Troubleshooting

- **Server not connecting:** Ensure the `url` uses the `https://` prefix and the JSON syntax is valid.
- **Authentication errors:** Verify that your Personal Access Token is correct and has not expired.
- **Configuration not loading:** Restart Trae if the MCP connection fails after making configuration changes.
