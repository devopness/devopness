# Devopness Documentation

The Devopness documentation website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Install dependencies

```bash
npm ci
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Production Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

### Using the web app
1. Sign in to Devopness on https://app.devopness.com/signin
2. Create a new application from this repository
3. Deploy the application

### Using AI Agents or an AI powered IDE (Claude, Cursor, VSCode, Windsurf, ...)
1. Install [Devopness MCP server](https://pypi.org/project/devopness-mcp-server/)
2. Submit a prompt into the chat, using the IDE `Agent mode`. E.g.: https://docs.cursor.com/chat/agent

#### Example prompt
```
use Devopness - using the context of the README.md file, deploy Devopness documentation website in @https://github.com/devopness/devopness/tree/main/docs to a single server on the "Production" environment in my project "<your project name>".

```

### Questions and Help? Join our Discord
1. Login to Devopness: https://app.devopness.com/
2. Click the `Join our Discord` link on your user profile menu
