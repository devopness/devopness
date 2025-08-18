---
title: Add Hetzner Credential
intro: To allow Devopness to manage Hetzner Cloud resources on your behalf, an API token must be provided.
links:
    overview:
    quickstart:
    previous:
    next: credentials/add-credential
    guides:
    related:
    featured:
---

> If you don't have access to a Hetzner account, you can create an account for free following the Hetzner Cloud [Sign Up](https://accounts.hetzner.com/signUp) page.

1. Log in to the [Hetzner Cloud Console](https://accounts.hetzner.com/login)
1. In the left navigation panel, click `Security`
1. At the top menu, select the `API Tokens` tab
1. Click `Generate API Token`
1. In the `Generate API Token` form:
    - Enter a **description** for the token (e.g., `Devopness`)
    - Set permissions as `Read & Write`
1. Click `Generate API Token`
1. **Copy the API token** shown
    - **Important:** The token will not be shown again, so make sure to save it securely
1. To add the token to Devopness, follow the guide: [/docs/credentials/add-credential]

> For more details, see the official Hetzner documentation on [Generating an API Token](https://docs.hetzner.com/cloud/api/getting-started/generating-api-token/)
