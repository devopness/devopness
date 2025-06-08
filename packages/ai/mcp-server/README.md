# Devopness MCP server

## Run

### Shell

```shell
uv run main.py
```

### Shell - with MCP inspector

```shell
# Using Anthropic's official MCP inspector
uv run mcp dev main.py

# Using alpic.ai MCP inspector
npx @alpic-ai/grizzly uv run main.py
```

### Postman

... TO DO: ... add step by step on how to add an MCP request using postman, link to postman docs, ...

STDIO
```shell
uv run --directory "/full/path/to/devopness/packages/ai/mcp-server/" main.py
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
        "main.py"
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
