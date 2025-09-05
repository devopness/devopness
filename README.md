# Devopness: DevOps Happiness :-) for AI Agents & humans

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/devopness/devopness/blob/main/LICENSE)

## Installation

Install the **Devopness MCP Server** in your favorite IDE:

[![Install Devopness MCP Server in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=devopness&config=eyJ1cmwiOiJodHRwczovL21jcC5kZXZvcG5lc3MuY29tL21jcC8ifQ==)

[![Install Devopness MCP Server in VS Code](https://img.shields.io/badge/VS_Code-000000?style=for-the-badge&label=Add%20to&labelColor=000000&color=000000
)](https://insiders.vscode.dev/redirect/mcp/install?name=devopness&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.devopness.com%2Fmcp%2F%22%7D)

> ⚠️ When the MCP Server is started in your IDE, it will require you to **log in with your Devopness Account** in order to authenticate and operate properly.

## Community
[![Discord Badge](https://img.shields.io/badge/Discord-5865F2?logo=discord&logoColor=fff&style=for-the-badge)](https://discord.gg/5KphsWxHeJ)

## About Devopness

`Devopness` drastically simplifies the way we manage cloud applications and multi cloud infrastructure in a secure and productive way.

Deovpness allows AI Agents and humans to provision and manage cloud infrastructure and deploy applications to `AWS`, `Azure`, `DigitalOcean`, `GCP`, ..., and any other major cloud provider.

* Simplified role based access control and permisson management
* No surprise on your cloud provider bills, as we only deploy the infra that each team of humans or agents have permissions to
* Full control on what AI Agents can do on your DevOps and CI/CD workflows
* Full visibility, auditing and traceability on what has been done by each person or agent in your teams

We're making first-class software deployment and cloud infrastructure management tools accessible and affordable to everyone who is involved in software projects.

## 📚 <a id="docs"></a>Documentation


Product documentation is maintained in the [docs](docs/) folder.

## 🙋 <a id="issues"></a>Issues

See the [issue backlog](https://github.com/devopness/devopness/issues) for a list of active or proposed tasks. Feel free to create new issues, report bugs, and send feature requests.

## ✍️ <a id="contributing"></a>Contributing

Improvements and contributions are highly encouraged! 🙏👊

See the [contributing guide](CONTRIBUTING.md) for details on how to participate.

All communication and contributions to Devopness projects are subject to the [Devopness Code of Conduct](CODE_OF_CONDUCT.md).

Not yet ready to contribute but do like the project? Support Devopness with a ⭐!

## 💼 <a id="changelog"></a>Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/devopness/devopness/releases).

## 📂 <a id="repo"></a>Repo Structure

This repository has the following packages/sub-projects:

### Packages

| Subpath                    | Package                   | Description                     |Status|
|:---------------------------|:--------------------------|:--------------------------------|-|
| [/docs](docs/)             | 📚 Documentation          | End user product documentation  |-|
| [/packages/sdks/javascript](packages/sdks/javascript/) | API SDK JavaScript  | API SDK to interact with Devopness using JavaScript and TypeScript |[![SDK JavaScript - CI](https://img.shields.io/github/actions/workflow/status/devopness/devopness/ci-sdk-javascript.yml?label=SDK%20JavaScript)](https://github.com/devopness/devopness/actions/workflows/ci-sdk-javascript.yml)<br>[![SDK JavaScript - Version](https://img.shields.io/npm/v/@devopness/sdk-js?label=SDK%20JavaScript)](https://www.npmjs.com/package/@devopness/sdk-js)|
| [/packages/sdks/python](packages/sdks/python/) | API SDK Python  | API SDK to interact with Devopness using Python |[![SDK Python - CI](https://img.shields.io/github/actions/workflow/status/devopness/devopness/ci-sdk-python.yml?label=SDK%20Python)](https://github.com/devopness/devopness/actions/workflows/ci-sdk-python.yml)<br>[![SDK Python - Version](https://img.shields.io/pypi/v/devopness?label=SDK%20Python)](https://pypi.org/project/devopness/)|
| [/packages/ui/react](packages/ui/react/) | UI React Components  | Devopness Design System UI components for React |[![UI React - CI](https://img.shields.io/github/actions/workflow/status/devopness/devopness/ci-ui-react.yml?label=UI%20React)](https://github.com/devopness/devopness/actions/workflows/ci-ui-react.yml)<br>[![UI React - Version](https://img.shields.io/npm/v/@devopness/ui-react?label=UI%20React)](https://www.npmjs.com/package/@devopness/ui-react)|

## 📜 <a id="license"></a>License

All repository contents are licensed under the terms of the [MIT License](LICENSE) unless otherwise specified in the `LICENSE` file at each package's root.
