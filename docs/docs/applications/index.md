---
title: Applications
links:
  overview:
  quickstart:
  previous:
  next: applications/add-application
  guides:
  related:
  featured:
---

An **application** in Devopness is the thing you want to build and run in one environment: your API, web app, worker, or internal tool.

It connects one git repository (or one folder in a monorepo) to that environment, so Devopness knows what to build, how to deploy it, and where it runs on your servers or serverless infrastructure.

Unlike many PaaS platforms that favor one runtime or framework, Devopness works with **any stack** you bring: Node, Python, PHP, Java, Ruby, Go, C#, and more.

## Think of it like this

- **Repository:** where your code lives on GitHub, GitLab, or Bitbucket
- **Environment:** a separate infrastructure setup inside one project (its own servers, applications, credentials, files, and deploy settings)
- **Application:** Devopness settings for one repository, or one folder in a monorepo, in one environment (branch, build commands, runtime)
- **Deploy:** the pipeline that builds your code and releases it to your servers
- **Files / variables:** configuration such as a `.env` file with environment variables for that environment
- **Virtual host:** optional public URL for publicly accessible APIs and web apps
- **Daemon or cron job:** optional long-running or scheduled processes for workers and background jobs

## About

- One environment can host many applications: your API, frontend, worker, docs site, internal tools, and more
- Each environment is fully isolated: its servers, applications, credentials, and configuration do not overlap with other environments in the same project
- Infrastructure can differ per environment: dev on one or two servers, production on many servers behind a load balancer, or on serverless cloud resources
- One application maps to the root directory of a repository, or to a specific folder in a monorepo when each service needs its own deploy settings
- During deployment, Devopness links your application to the target servers you choose
- Applications keep deploy settings, pipelines, files, and related resources together for each environment

## Who this is for

- Developers shipping web apps, APIs, workers, or internal tools on their own servers
- Team leads who want one place to manage releases per environment
- Anyone moving beyond single-stack PaaS limits who needs full control over runtime and infrastructure
- If you automate with an IDE or agent, Devopness MCP can help you list, inspect, and deploy applications too

## Why this exists

Applications give you a stable, repeatable way to build and deploy a specific codebase in a specific environment.
You define the source once; Devopness handles the pipeline, server placement, and related configuration from there.

## Relationship to other concepts

- **Projects** group related work for one product or client
- **Environments** are separate infrastructure setups inside a project. Names like Development, Staging, and Production are common; deploy to dev first, then promote stable work to staging and production
- **Servers** receive your deploys (Devopness assigns them on first deploy when needed)
- **Pipelines** define build and deploy steps for your stack
- **Files** store environment configuration such as `.env`
- **Virtual hosts** expose a public API or web app on a domain or server IP
- **Daemons and cron jobs** keep private or background workloads running without a public URL

## Practical example

A startup adds three applications in one Production environment: same team, same release stage, separate deploy settings.

- `acme/api`: an API in Node, Python, PHP, Java, Ruby, Go, C#, or another supported stack
- `acme/web`: a frontend in React, Next.js, Vite, TanStack Router, or another static or SSR framework
- `acme/worker`: a queue consumer or background job processor with no public URL

They add configuration files (for example `.env` per application), deploy each one, add a [virtual host](/docs/virtual-hosts/add-virtual-host) for the API and web app, and use [daemons](/docs/daemons/add-daemon) or [cron jobs](/docs/cronjobs/add-cronjob) to run the worker.

## First deploy path

If this is your first application in Devopness:

1. [Add an application](/docs/applications/add-application): connect your repository to this environment
2. Add [configuration files](/docs/files/add-file), for example a `.env` with environment variables
3. [Deploy](/docs/applications/deploy-application): build and release your code (Devopness links a server on first deploy when needed)
4. Choose what fits your app:
   - **Public API or web app:** [add a virtual host](/docs/virtual-hosts/add-virtual-host)
   - **Private worker or batch job:** add a [daemon](/docs/daemons/add-daemon) or [cron job](/docs/cronjobs/add-cronjob); no virtual host required

## Common questions

- **One repo or many applications?** One application per repo is common; use separate applications with different root directories when one monorepo contains the source code for multiple applications, which is usually identifiable on directories that contain package manager lock files and configuration files, examples: package.json, composer.json, Gemfile, pyproject.toml, Dockerfile, docker-compose.yaml, etc
- **Dev, staging, and production?** Use separate environments when infrastructure must stay isolated. Dev might run on one or two servers; production might scale to many servers, load balancers, or serverless targets. Deploy to dev first, then move stable work to staging and production
- **Do I need a virtual host?** Only when the app should be reachable on the internet; workers and internal tools usually do not need one

## Start here

- [Add an application](/docs/applications/add-application)
- [Deploy an application](/docs/applications/deploy-application)
- [List applications](/docs/applications/list-applications)
