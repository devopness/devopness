---
slug: /
title: Get started with Devopness
description: Deploy applications, provision servers, and manage serverless infrastructure in your cloud accounts with Devopness. Multi-cloud support, permissions per environment, and AI-ready DevOps through MCP.
pagination_next: organizations/add-organization
---

## About

Devopness helps you deploy apps and manage servers and serverless infrastructure in your own cloud accounts on AWS, Azure, Google Cloud, DigitalOcean, Hetzner, and others.

You can use the [web app](https://app.devopness.com/), the API, or [/docs/mcp] when Devopness is connected to your AI agents.

## Why Devopness exists

Today many software teams:

- Wait on a DevOps specialist, platform team, or contractor for servers, deploys, and small config changes
- Use many tools: Terraform or Ansible for infrastructure, CI pipelines like Jenkins or GitHub Actions, and separate services for SSL and DNS
- Struggle to move apps between cloud providers because each one has different consoles and deployment workflows
- Rely on platforms like Vercel or Heroku that start simple but become expensive or hard to leave as apps grow
- Write code faster with AI, but still wait too long to get that code running in production

Devopness combines what is usually split across multiple tools into one platform:

- Infrastructure provisioning and server configuration (instead of Terraform and Ansible)
- CI/CD and deployments (instead of Jenkins, GitHub Actions, Vercel, Heroku, and other PaaS)
- One simpler workflow for any tech stack and any cloud provider, in accounts you control

People and AI agents can work from the web app, API, or MCP on a laptop, phone, or tablet.

Fine-grained, role-based permissions per environment let teammates deploy without direct cloud-console access, improving security and access control.

This helps you deploy more often to infrastructure you control, without needing deep expertise in every cloud provider.

## What Devopness gives you

- Ship your apps to infrastructure you own, with more frequent and safer deploys
- Trigger zero-downtime deploys automatically when you push to git
- See deploy history and infrastructure changes in one place, even from mobile, without SSH or cloud console access
- Manage servers and deploys from the web app, without manual CLI workflows for routine tasks
- Run DevOps operations in natural language through MCP when connected to your AI agents

## How Devopness is organized

Think of it like this:

- **Organization:** one company, legal entity, or client portfolio in Devopness, like `/@acme`
- **Project:** one product or client inside that organization
- **Environment:** a separate infrastructure setup inside a project (its own servers, applications, credentials, and deploy settings). Names like `Development`, `Staging`, and `Production` are common
- **Application:** one git repository (or one folder in a monorepo) connected to one environment

Read more in [/docs/organizations], [/docs/projects], and [/docs/environments].

## Who this is for

- Developers who ship apps, side projects, and cloud infrastructure
- Team leads who want to simplify deploy workflows, speed up releases, and cut down on complex tooling
- Founders and solo builders deploying from day one on cloud infrastructure they control
- Freelancers and agencies who need fast deploys and separate client infrastructure at an affordable cost

## Where to start

- [Create an account and sign in](https://app.devopness.com/). It is free, and no credit card is required.
- Follow the **Getting started** section in the sidebar for the first-setup path from organization creation through creating a server and deploying your application
- Watch walkthroughs on the [Devopness YouTube channel](https://www.youtube.com/@devopness)

## Get help

If you need help, contact us on [GitHub](https://github.com/devopness/devopness/discussions) or join our [Discord](https://devopness.com/discord/).

## Report a vulnerability

If you found a vulnerability in our product, please follow the guide [/docs/security/reporting-a-security-vulnerability].
