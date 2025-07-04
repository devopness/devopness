---
title: Add an Application
intro: Add applications to your infrastructure environments so they can be managed and deployed directly by web interface or through automated workflows
links:
    overview:
    quickstart:
    previous: servers/ssh-into-server
    next: applications/list-applications
    guides:
    related:
    featured:
required_permissions:
    - application:create
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. On the upper-right corner of the list click `ADD APPLICATION`
1. Select a `Source Provider`
1. Select a `Credential`
    > If no credential is listed or you want to use a different one, click `Create a new Credential` and follow the guide [/docs/credentials/add-credential]
1. Once a `Credential` is selected, select the git repository where the application source code is hosted
1. Follow the prompts then click `CONFIRM`
1. In the `Application` details view, the recently created `Application` details can be seen

:::note
After adding an application, you can view all your applications in the [list applications](/docs/applications/list-applications) page and access specific application details on the [view application](/docs/applications/view-application) page.
:::
