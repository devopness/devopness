# Devopness - Packages

## Overview

This directory contains libraries and packages built and published to package registries such as [npm](https://www.npmjs.com/) and [PyPI](https://pypi.org/).

Each subfolder groups packages by purpose (SDKs, UI components, shared artifacts).

## Packages

| Subpath | Package | Description |
|:--------|:--------|:------------|
| [/sdks/javascript](sdks/javascript/) | `@devopness/sdk-js` | JavaScript/TypeScript API SDK |
| [/sdks/python](sdks/python/) | `devopness` | Python API SDK |
| [/sdks/common](sdks/common/) | (internal) | Shared OpenAPI spec and generation inputs for SDKs |
| [/ui/react](ui/react/) | `@devopness/ui-react` | React design system components |

For CI status and published versions, see the [repository README](../README.md#repo).

## Contributing

See the [contributing guide](../CONTRIBUTING.md). Package changes that affect published artifacts require a [changeset](../CONTRIBUTING.md#changesets) — see [`.changeset/README.md`](../.changeset/README.md).
