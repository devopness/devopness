# Developer guide to contribute to this MCP server

## Run locally

### Run from latest package published on PyPi

```shell
uvx devopness-mcp-server
```

### Run from source

```shell
uv run devopness-mcp-server
```

### Run enabling MCP inspector

```shell
# Using Anthropic's official MCP inspector
uv run mcp dev src/devopness_mcp_server/main.py

# Using alpic.ai MCP inspector - from PyPi
npx @alpic-ai/grizzly uvx devopness-mcp-server

# Using alpic.ai MCP inspector - from source
npx @alpic-ai/grizzly uv run devopness-mcp-server
```

### Run on Postman

Follow Postman guide to [create an MCP Request](https://learning.postman.com/docs/postman-ai-agent-builder/mcp-requests/create/)
* Choose `STDIO`
* Use the server command below

```shell
uv run --directory "/full/path/to/devopness/packages/ai/mcp-server/src/devopness_mcp_server" main.py
```

### Run from source, on AI powered IDEs

To run from source on tools such as Claude, Cursor, Visual Studio Code, Windsurf, etc
* Find the and edit the `mcp.json` file on your favourite tool
* add `devopness` MCP servre as exemplified below


Example: **~/.cursor/mcp.json**:

```json
{
  "devopness": {
    "command": "uv",
    "args": [
      "--directory",
      "/full/path/to/devopness/packages/ai/mcp-server/src/devopness_mcp_server",
      "run",
      "main.py"
    ],
    "env": {
      "DEVOPNESS_USER_EMAIL": "YOUR_DEVOPNESS_USER_EMAIL",
      "DEVOPNESS_USER_PASSWORD": "YOUR_DEVOPNESS_USER_PASSWORD"
    }
  }
}
```
