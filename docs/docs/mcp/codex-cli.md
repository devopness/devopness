---
title: Install Devopness MCP Server on Codex CLI
---

Connect Codex CLI to the Devopness MCP server and authorize access with your Devopness account.

## Prerequisites

1. An active Devopness account
2. [Codex CLI](https://developers.openai.com/codex/cli) installed on your machine

Verify that Codex CLI is available:

```bash
codex --version
```

## Configure the MCP server

Add the Devopness remote MCP server:

```bash
codex mcp add --url https://mcp.devopness.com/mcp/ devopness
```

Codex detects OAuth support and opens the Devopness authorization flow in your browser.

1. Sign in to your Devopness account
2. Review and authorize the requested access
3. Return to the terminal and wait for the successful login message

If the authorization flow does not start or was interrupted, run:

```bash
codex mcp login devopness
```

## Verify the connection

List the configured MCP servers:

```bash
codex mcp list
```

Verify that `devopness` is enabled and its authentication status is `OAuth`.

Inspect the server configuration:

```bash
codex mcp get devopness
```

The output must show the streamable HTTP transport and the Devopness MCP URL.

## Use the MCP server

Start a new Codex session so it loads the MCP server:

```bash
codex
```

Ask Codex to use the configured server explicitly:

```text
Use the devopness MCP server to return my current Devopness user profile.
```

Codex should call the Devopness user profile tool and return the authenticated user's details.

You can then use prompts such as:

- "Use Devopness to list my projects"
- "Use Devopness to show the environments in the example project"
- "Use Devopness to list the servers in production"

## Troubleshooting

- **OAuth did not start:** Run `codex mcp login devopness`
- **OAuth callback failed:** Allow connections to the temporary localhost callback URL and verify that your browser can access `https://mcp.devopness.com`
- **Server is not available in a session:** Exit and restart Codex after adding or authenticating the server
- **Authentication is stale:** Run `codex mcp logout devopness`, then `codex mcp login devopness`
- **Other MCP servers fail during startup:** Run `codex mcp list` and verify `devopness` separately. A warning for another server does not mean the Devopness connection failed
- **Devopness tools are not used:** Name the `devopness` MCP server explicitly in the prompt and verify the OAuth status with `codex mcp list`

## Expected result

Codex CLI can call Devopness MCP tools with the permissions of your authorized Devopness account.

To remove the connection, run:

```bash
codex mcp remove devopness
```
