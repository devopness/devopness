---
title: Add Microsoft Azure Credential
intro: In order to allow Devopness to manage Azure resources on your behalf, Service Principal credentials have to be provided.
links:
    overview:
    quickstart:
    previous: credentials/add-aws-credential
    next: credentials/add-digitalocean-credential
    guides:
    related:
    featured:
---

> If you don't have access to an Azure account, you can create an account for free following the cloud provider specific guide [Azure Free Services](https://azure.microsoft.com/en-us/pricing/free-services)

1. Log in to [Azure Portal](https://portal.azure.com/)
1. In the search bar, enter `App registrations` and select it
1. In the navigation bar, select `New registration`
1. Type the **Name** of the application
   - Tip: you might want to name the application as `devopness` to make it easier to track its activities
1. Under **Supported account types**, select `Accounts in this organizational directory only`
1. Under **Redirect URI**, select platform `Web`
1. Click `Register`
1. Copy the `Application (client) ID` as the value of `client_id`
1. Copy the `Directory (tenant) ID` as the value of `tenant_id`
1. In the navigation panel search bar on the left side, enter `Certificates & secrets` and select it
1. In the **Client secrets** tab, click `New client secret`
1. Type the **Description** of the client secret
1. Choose one option for **Expires** time
1. Click `Add`
1. Copy the `Value` of the client secret as the value of `client_secret`
1. In the search bar, enter `Subscriptions` and select it
1. Click on the `Subscription name` link of one of the subscriptions in the list
1. Copy the `Subscription ID` as the value of `subscription_id`
1. In the navigation panel on the left side, select `Access control (IAM)`
1. You can set permissions by using an Azure pre-defined role or creating a custom role with only the necessary permissions

      - Using a pre-defined role:

      :::note

      1. In the navigation bar, click on `Add` and select `Add role assignment`
      1. In the **Role - Privileged administrator roles** tab, select `Contributor` role
      1. Click `Next`
      1. In the **Members** tab, click `Select members`
      1. In the `Select members` search bar, type the name of **application** and select it
      1. Click `Select` and click `Review + assign`
      1. Ensure the **Role Contributor** and expected **application** are selected
      1. Click `Review + assign` again

      :::

      - Using a custom role:

      :::note

      1. In the navigation bar, click on `Add` and select `Add custom role`
      1. Type the **Custom role name** of the role
           - Tip: you might want to name the role as `devopness` to make it easier to identify
      1. Under **Baseline permissions**, select `Start from scratch`
      1. Click `Next`
      1. In the navigation bar, click on `Add permissions`
      1. Add each of the following **permissions** to the role:

            <details>
            <summary>Permissions</summary>

            - **Microsoft.Authorization/roleAssignments \{read\}**
            - **Microsoft.Authorization/roleDefinitions \{read\}**
            - **Microsoft.Compute/disks \{write\}**
            - **Microsoft.Compute/virtualMachines \{deallocate/action, delete, read, restart/action, start/action, write\}**
            - **Microsoft.Network/networkInterfaces \{delete, join/action, read, write\}**
            - **Microsoft.Network/networkSecurityGroups \{delete, join/action, read, write\}**
            - **Microsoft.Network/networkSecurityGroups/securityRules \{delete, read, write\}**
            - **Microsoft.Network/publicIPAddresses \{delete, join/action, read, write\}**
            - **Microsoft.Network/virtualNetworks \{delete, read, write\}**
            - **Microsoft.Network/virtualNetworks/subnets \{delete, join/action, read, write\}**
            - **Microsoft.Resources/subscriptions/resourceGroups \{read, write\}**

            </details>

      1. After adding the **permissions**, click `Review + create` in the navigation bar
      1. Click `Create`
      1. In **Access control (IAM)** page, in the navigation bar, click on `Add` and select `Add role assignment`
      1. In the **Role - Job function roles** tab, search and select `your custom role`
      1. Click `Next`
      1. In the **Members** tab, click `Select members`
      1. In the `Select members` search bar, type the name of **application** and select it
      1. Click `Select` and click `Review + assign`
      1. Ensure the expected **role** and **application** are selected
      1. Click `Review + assign` again

      :::

1. To add the credential to Devopness see [/docs/credentials/add-credential]
