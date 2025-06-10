# Devopness MCP server

## Run

### Shell

**Latest Published on PyPi:**

```shell
uvx devopness-mcp-server
```

**Run from source:**

```shell
uv run devopness-mcp-server
```

### Shell - with MCP inspector

```shell
# Using Anthropic's official MCP inspector
uv run mcp dev src/devopness_mcp_server/main.py

# Using alpic.ai MCP inspector - from PyPi
npx @alpic-ai/grizzly uvx devopness-mcp-server

# Using alpic.ai MCP inspector - from source
npx @alpic-ai/grizzly uv run devopness-mcp-server
```

### Postman

... TO DO: ... add step by step on how to add an MCP request using postman, link to postman docs, ...

STDIO

```shell
uv run --directory "/full/path/to/devopness/packages/ai/mcp-server/" devopness-mcp-server
```

### Claude Desktop

... TO DO: ...

### Cursor

**~/.cursor/mcp.json**:

```json
{
  "mcpServers": {
    "Devopness": {
      "command": "uv",
      "args": [
        "--directory",
        "/full/path/to/devopness/packages/ai/mcp-server/",
        "run",
        "devopness-mcp-server"
      ],
      "env": {
        "DEVOPNESS_USER_EMAIL": "<email address>",
        "DEVOPNESS_USER_PASSWORD": "<password>",
      }
    }
  }
}

```

### VS Code

... TO DO: ...

### Windsurf

... TO DO: ...
