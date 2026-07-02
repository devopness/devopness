<p align="center">
  <a href="https://www.devopness.com/">
    <img src="https://assets.devopness.com/images/logo-devopness-primary.svg" alt="Devopness" width="220">
  </a>
</p>

<h1 align="center">Devopness</h1>

<p align="center"><strong>Stop managing DevOps. Ship more, stress less.</strong></p>

<p align="center"><em>DevOps Happiness for AI agents and humans.</em></p>

<h3 align="center">One platform · Any cloud · Any stack · Free plan</h3>

Deploy apps and **provision cloud infrastructure from scratch** on AWS, Azure, GCP, DigitalOcean, and Hetzner — in accounts you control.

One platform to replace many tools: Terraform + Ansible + Jenkins + PaaS (Vercel, Heroku, etc), and stack-specific server panels.

Manage apps, Linux servers, and cloud infrastructure from anywhere — web, mobile, API, or natural language in your AI agent through MCP. No SSH or cloud console for routine work.

<div align="center">

[![npm](https://img.shields.io/npm/v/@devopness/sdk-js?label=npm)](https://www.npmjs.com/package/@devopness/sdk-js)
[![PyPI](https://img.shields.io/pypi/v/devopness?label=pypi)](https://pypi.org/project/devopness/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Discord](https://img.shields.io/discord/1354644459031232655?label=discord&color=5865F2&logo=discord&logoColor=white)](https://discord.gg/WxKbZ3g37Q)
[![GitHub stars](https://img.shields.io/github/stars/devopness/devopness?style=social)](https://github.com/devopness/devopness/stargazers)

**[Create free account](https://app.devopness.com/)** · [Docs](https://www.devopness.com/docs/) · [Discord](https://discord.gg/WxKbZ3g37Q)

</div>

## For AI agents (MCP)

Ask your AI agent to provision servers, deploy apps, migrate between clouds, and manage infrastructure through one MCP server — not a separate integration per cloud or stack.

**One-click install**

[![Install Devopness MCP Server in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=devopness&config=eyJ1cmwiOiJodHRwczovL21jcC5kZXZvcG5lc3MuY29tL21jcC8ifQ==)

[![Install Devopness MCP Server in VS Code](https://img.shields.io/badge/VS_Code-000000?style=for-the-badge&label=Add%20to&labelColor=000000&color=000000)](https://insiders.vscode.dev/redirect/mcp/install?name=devopness&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.devopness.com%2Fmcp%2F%22%7D)

Example prompt:

> Migrate my app from AWS to Hetzner.

![AI agent migrating an app from AWS to Hetzner through Devopness MCP](.github/readme/mcp-terminal-demo.gif)

Starting the MCP server prompts you to log in with your Devopness account.

**MCP-compatible clients:** Cursor, VS Code, Claude Code, Codex CLI, Gemini CLI, Windsurf, Zed, Warp, JetBrains AI, and more. See step-by-step guides in [MCP docs](https://www.devopness.com/docs/mcp/).

## What Devopness replaces

Many self-hosted deploy tools (Coolify, Dokploy, and similar) assume you already provisioned a server and can connect over SSH. Devopness provisions infrastructure in your cloud from scratch, configures Linux, and deploys your apps. Routine work runs from the web app, API, or MCP: no SSH and no cloud console for everyday tasks.

Devopness combines what teams usually split across multiple tools into one platform:

**Cloud infrastructure from scratch**

- Networks, subnets, static IPs, servers, and Linux configuration in your cloud accounts (instead of Terraform, Ansible, and manual cloud console work)

**CI/CD and hosted PaaS**

- Deploy pipelines and hosted platforms (instead of Jenkins, GitHub Actions, GitLab CI, Vercel, Heroku, Netlify, Railway, Render, and similar PaaS)

**Server and app management panels**

Instead of separate panels per stack, use one platform for all stacks. Devopness replaces:

- **PHP:** cPanel, Laravel Forge/Envoyer, Plesk, RunCloud, ServerPanel.app
- **Python:** FastAPI Cloud, and similar stack-focused tools
- **Ruby:** Cloud 66, Hatchbox, Kamal (popular in Rails, works for any stack)
- **Self-hosted (bring your own server):** Coolify, Dokploy

## What you get

- Trigger zero-downtime deploys automatically when you push to git
- See deploy history and infrastructure changes in one place, even from mobile, without SSH or cloud console access
- Fine-grained, role-based permissions per environment so teammates deploy without direct cloud-console access
- Run DevOps operations in natural language through MCP when connected to your AI agents

## Quick start

1. **[Create an account](https://app.devopness.com/)**: free, no credit card required
2. **[Follow Getting Started](https://www.devopness.com/docs/)**: organization → project → environment → first deploy
3. **[Connect MCP](https://www.devopness.com/docs/mcp/)**: optional; one-click in Cursor or VS Code above

For developers, team leads, founders, and agencies shipping on cloud infrastructure they control.

<p align="center">
  <a href="https://www.devopness.com/">
    <img src="https://assets.devopness.com/images/site-case-deploy.png" alt="Devopness deploy flow" width="640">
  </a>
</p>

## This repository

Open source packages and documentation for [Devopness](https://www.devopness.com/):

| Path                                                   | Package               | Description                                                 |
| :----------------------------------------------------- | :-------------------- | :---------------------------------------------------------- |
| [/docs](docs/)                                         | Documentation         | Product docs                                                |
| [/packages/sdks/javascript](packages/sdks/javascript/) | `@devopness/sdk-js`   | JavaScript/TypeScript API SDK                               |
| [/packages/sdks/python](packages/sdks/python/)         | `devopness`           | Python API SDK                                              |
| [/packages/ui/react](packages/ui/react/)               | `@devopness/ui-react` | React design system                                         |
| [/examples/applications](examples/applications/)       | Examples              | Sample app integrations (Rails, Express, Laravel, and more) |

## Community

- [Discord](https://discord.gg/WxKbZ3g37Q)
- [GitHub Discussions](https://github.com/devopness/devopness/discussions)
- [YouTube](https://www.youtube.com/@devopness)

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). If you use AI tools, also read [AGENTS.md](AGENTS.md). All contributions are subject to the [Code of Conduct](CODE_OF_CONDUCT.md).

Like the project? **[Star this repo](https://github.com/devopness/devopness/stargazers)**: it helps others discover Devopness.

Release notes: [GitHub Releases](https://github.com/devopness/devopness/releases). [MIT License](LICENSE) unless otherwise specified in a package `LICENSE` file.
