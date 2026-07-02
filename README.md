# Devopness: deploy apps and manage servers on your own cloud

**Stop managing DevOps. Ship more, stress less.**

Deploy apps and **provision cloud infrastructure from scratch** in your own accounts (AWS, Azure, GCP, DigitalOcean, Hetzner): networks, subnets, static IPs, servers, Linux configuration, and deploys. One platform instead of Terraform, Jenkins, PaaS (Vercel, Heroku, etc), and server and app management panels.

**One MCP server** for Cursor, VS Code, and other AI agents: manage any cloud, any infrastructure, any Linux version, and any stack (C#, Docker, Go, HTML, Java, Node.js, PHP, Python, Ruby, TypeScript, and more).

[![Website](https://img.shields.io/badge/website-devopness.com-orange?style=flat-square)](https://www.devopness.com/)
[![Docs](https://img.shields.io/badge/docs-read-blue?style=flat-square)](https://www.devopness.com/docs/)
[![Start free](https://img.shields.io/badge/start_free-app.devopness.com-green?style=flat-square)](https://app.devopness.com/)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/devopness/devopness?style=social)](https://github.com/devopness/devopness/stargazers)

## For AI agents (MCP)

Ask your AI agent to provision servers, deploy apps, migrate between clouds, and manage infrastructure. Devopness executes through a secure MCP server.

**One-click install**

[![Install Devopness MCP Server in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=devopness&config=eyJ1cmwiOiJodHRwczovL21jcC5kZXZvcG5lc3MuY29tL21jcC8ifQ==)

[![Install Devopness MCP Server in VS Code](https://img.shields.io/badge/VS_Code-000000?style=for-the-badge&label=Add%20to&labelColor=000000&color=000000)](https://insiders.vscode.dev/redirect/mcp/install?name=devopness&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.devopness.com%2Fmcp%2F%22%7D)

Example prompt:

> Migrate my app from AWS to Hetzner.

![AI agent migrating an app from AWS to Hetzner through Devopness MCP](.github/readme/mcp-terminal-demo.gif)

> When you start the MCP server, you will be asked to **log in with your Devopness account** to authenticate.

**Other supported tools:** Claude Code, Codex CLI, Gemini CLI, Windsurf, Zed, Warp, JetBrains AI, and more. See step-by-step guides in [MCP docs](https://www.devopness.com/docs/mcp/).

[![Deploy flow](https://assets.devopness.com/images/site-case-deploy.png)](https://www.devopness.com/)

## Provision from scratch, not just connect a server

Many self-hosted deploy tools (Coolify, Dokploy, and similar) assume you already provisioned a server and can connect over SSH.

Devopness provisions infrastructure in your cloud from scratch, configures Linux, and deploys your apps. Routine work runs from the web app, API, or MCP: no SSH and no cloud console for everyday tasks.

## What Devopness replaces

Devopness combines what teams usually split across multiple tools into one platform:

**Cloud infrastructure from scratch**

- Networks, subnets, static IPs, servers, and Linux configuration in your cloud accounts (instead of Terraform, Ansible, and manual cloud console work)

**CI/CD and hosted PaaS**

- Deploy pipelines and hosted platforms (instead of Jenkins, GitHub Actions, GitLab CI, Vercel, Heroku, Netlify, Railway, Render, and similar PaaS)

**Server and app management panels**

Instead of separate panels per stack, use one platform for all stacks. Devopness replaces:

- **PHP:** cPanel, Laravel Forge/Envoyer, Plesk, RunCloud, [ServerPanel.app](https://serverpanel.app/)
- **Python:** FastAPI Cloud, and similar stack-focused tools
- **Ruby:** Cloud 66, Hatchbox, Kamal (popular in Rails, works for any stack)
- **Self-hosted (bring your own server):** Coolify, Dokploy

**One workflow everywhere**

- One simpler workflow for any tech stack and any cloud provider, in accounts you control

## What you get

- Ship your apps to infrastructure you own, with more frequent and safer deploys
- Trigger zero-downtime deploys automatically when you push to git
- See deploy history and infrastructure changes in one place, even from mobile, without SSH or cloud console access
- Provision networks, subnets, static IPs, and servers in your cloud, then configure Linux and deploy apps without SSH for routine tasks
- Fine-grained, role-based permissions per environment so teammates deploy without direct cloud-console access
- Run DevOps operations in natural language through MCP when connected to your AI agents

## Quick start

1. **[Create an account](https://app.devopness.com/)**: free, no credit card required
2. **[Follow Getting Started](https://www.devopness.com/docs/)**: workspace → project → environment → first deploy
3. **[Connect MCP](https://www.devopness.com/docs/mcp/)**: optional; one-click in Cursor or VS Code above

## Who this is for

- Developers who ship apps, side projects, and cloud infrastructure
- Team leads who want to simplify deploy workflows, speed up releases, and cut down on complex tooling
- Founders and solo builders deploying from day one on cloud infrastructure they control
- Freelancers and agencies who need fast deploys and separate client infrastructure at an affordable cost

## This repository

Open source packages and documentation for [Devopness](https://www.devopness.com/):

| Path                                                   | Package               | Description                                                                                                                                       |
| :----------------------------------------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| [/docs](docs/)                                         | Documentation         | Product docs (published at [devopness.com/docs](https://www.devopness.com/docs/))                                                                 |
| [/packages/sdks/javascript](packages/sdks/javascript/) | `@devopness/sdk-js`   | JavaScript/TypeScript API SDK [![npm](https://img.shields.io/npm/v/@devopness/sdk-js?label=npm)](https://www.npmjs.com/package/@devopness/sdk-js) |
| [/packages/sdks/python](packages/sdks/python/)         | `devopness`           | Python API SDK [![PyPI](https://img.shields.io/pypi/v/devopness?label=pypi)](https://pypi.org/project/devopness/)                                 |
| [/packages/ui/react](packages/ui/react/)               | `@devopness/ui-react` | React design system [![npm](https://img.shields.io/npm/v/@devopness/ui-react?label=npm)](https://www.npmjs.com/package/@devopness/ui-react)       |
| [/examples/applications](examples/applications/)       | Examples              | Sample app integrations (Rails, Express, Laravel, and more)                                                                                       |

## Community

- [Discord](https://devopness.com/discord/)
- [GitHub Discussions](https://github.com/devopness/devopness/discussions)
- [YouTube](https://www.youtube.com/@devopness)

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). If you use AI tools, also read [AGENTS.md](AGENTS.md).

All contributions are subject to the [Code of Conduct](CODE_OF_CONDUCT.md).

Like the project? **[Star this repo](https://github.com/devopness/devopness/stargazers)**: it helps others discover Devopness.

## Changelog

Release notes: [GitHub Releases](https://github.com/devopness/devopness/releases)

## License

[MIT License](LICENSE) unless otherwise specified in a package `LICENSE` file.
