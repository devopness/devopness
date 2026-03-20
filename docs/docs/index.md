---
slug: /
sidebar_position: 1
title: Introduction to Devopness
links:
  overview:
  quickstart:
  previous: organizations/add-organization
  next: organizations/index
  guides:
  featured:
---

Managing cloud infrastructure is harder than it should be. Most teams juggle multiple provider consoles, each with its own concepts, permissions model, and learning curve. As teams grow and projects multiply, deployments get bottlenecked, access control breaks down, and visibility disappears.

Devopness removes that friction. It connects to your existing cloud accounts on AWS, GCP, Azure, DigitalOcean, Hetzner, and others, giving you a single platform to provision infrastructure, deploy applications, and run CI/CD pipelines for any stack. You bring your own cloud (BYOC): your accounts, your costs, your data. Devopness provides the control plane.

For teams adopting AI, Devopness ships an MCP Server that lets AI agents provision infrastructure and deploy applications in natural language, subject to the same role-based permissions and audit trails that apply to your human team.

## How Devopness is organized

Devopness uses a three-level hierarchy: organizations contain projects, and projects contain environments. An organization is your company or team. A project is a product or system. An environment is a deployment target, such as Production, Staging, or Development.

Each environment holds all the resources needed to run your application: servers, networks, applications, pipelines, SSL certificates, cron jobs, SSH keys, and more. Teams and roles are scoped per environment, so you control exactly who can do what.

Everything in Devopness is also available through a REST API. You can authenticate with personal access tokens tied to your account, or project-scoped API tokens for CI/CD pipelines and automation scripts.

## Start here

1. [Sign up](https://app.devopness.com).
2. Follow the onboarding wizard to create your first organization.
3. Create a project inside your organization.
4. Add an environment (`Development`, `Staging`, `Production`).
5. Connect your cloud provider credentials and Git repository.
6. Deploy your first app.

## Community

If you need help, contact us on [GitHub](https://github.com/devopness/devopness/discussions) or join our [Discord community](https://devopness.com/discord/).
