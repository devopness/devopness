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
    - Enter a **description** for the token (e.g., `Devopness`) to help track its usage
    - Choose the **Read & Write** permission (required for Devopness)
        - This permission allows Devopness to fully manage your cloud resources, such as creating, updating, and deleting servers.
        - **Do not select "Read"**, as it only allows viewing resources and will not work with Devopness.
1. Click `Generate API Token`
1. **Copy the API token** shown
    - It will be a long string of characters
    - **Important:** The token will not be shown again, so make sure to save it securely
1. To add the token to Devopness, follow the guide: [/docs/credentials/add-credential]

> For more details, see the official Hetzner documentation on [Generating an API Token](https://docs.hetzner.com/cloud/api/getting-started/generating-api-token/)
