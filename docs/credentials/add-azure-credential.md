---
title: Add Microsoft Azure Credential
intro: In order to allow Devopness to manage Azure resources on your behalf, Service Principal credentials have to be provided.
links:
    overview:
    quickstart:
    previous:
    next: /docs/credentials/add-credential
    guides:
    related:
    featured:
---

> If you don't have access to an Azure account, you can create an account for free following the cloud provider specific guide [Azure Free Services](https://azure.microsoft.com/en-us/pricing/free-services)

1. Log in to [Azure Portal](https://portal.azure.com/)
1. In the search bar, type and select `App registrations`
1. In the navigation bar, select `New registration`
1. Type the **Name** of the application
   - Tip: you might want to name the application as `devopness` to make it easier to track its activities
1. Under **Supported account types**, select `Accounts in this organizational directory only` 
1. Under **Redirect URI**, select platform `Web`
1. Click `Register`
1. Copy the `Application (client) ID` as the value of `client_id`
1. Copy the `Directory (tenant) ID` as the value of `tenant_id`
1. In the navigation pane on the left side, select `Certificates & secrets`
1. In the **Client secrets** tab, click `New client secret`
1. Type the **Description** of the client secret
1. Choose one option for **Expires** time
1. Click `Add`
1. Copy the `Value` of the client secret as the value of `client_secret`
1. In the search bar, type and select `Subscriptions`
1. Access one of the subscriptions in the list
1. Copy the `Subscription ID` as the value of `subscription_id`
1. In the navigation pane on the left side, select `Access control (IAM)`
1. In the navigation bar, click on `Add` and select `Add role assignment`
1. In the **Role - Privileged administrator roles** tab, select `Contributor` role
1. Click `Next`
1. In the **Members** tab, select `Select members`
1. Type the name of **application** and select it
1. Click `Select` and click `Review + assign`
1. Ensure the correct **role** is selected, and the correct **application** is selected
1. Click `Review + assign` again
1. To add the credential to Devopness see {% mentionPost "/docs/credentials/add-credential" %}
