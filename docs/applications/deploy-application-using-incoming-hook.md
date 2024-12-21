---
title: Deploy Application using an Incoming Hook
intro: As project users base grow, there's a need to rely more on processes and automation; Devopness helps by providing, among other tools, customizable CI/CD pipelines, empowering our users to automate common and repetitive tasks to improve code quality and their code review processes. Create an incoming webhook to trigger an application deploy programmatically.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

Before creating an incoming webhook to trigger an `application:deploy`, we need the ID of a pipeline that runs the `deploy` operation for an application. The ID (`<pipeline_id>`) will be used as input parameter in the requests to be sent to Devopness API.

<details open>
  <summary>Steps to find the <code>&lt;pipeline_id&gt;</code> of an <code>application:deploy</code> pipeline</summary>

1. On Devopness, navigate to a project then select an environment
1. Find the `Applications` card
1. Click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications, find the application with the pipeline you want to manage and click the `NAME` of the application
1. Click the `Pipelines` tab
1. In the list of pipelines, find the pipeline you want to manage and click the `NAME` of the pipeline
    > If you haven't created a pipeline yet, follow the [/docs/pipelines/add-pipeline] guide
1. Copy the `<pipeline_id>` from the pipeline details URL, considering the following URL format:
    ```bash
    https://app.devopness.com/projects/<project_id>/environments/<environment_id>/applications/<application_id>/pipelines/<pipeline_id>
    ```

</details>

Once you have your `<pipeline_id>`, please follow the instructions below to add an incoming webhook to your application that triggers the deploy pipeline:

1. Follow the steps on [/docs/webhooks/create-incoming-webhook] guide
1. Once your web hook is created, copy the hook's unique URL (`url` field)
1. Take note of the hook's secret signature key (`secret` field)
    > If the hook was created without a `secret` (non recommended), you can skip this step
1. Add your webhook to the source provider where each application's source code is hosted, by following the source provider's instructions on the links below:
    - Bitbucket: [Manage webhooks: create webhooks](https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/#Create-webhooks)
    - Github: [Webhooks: setting up a webhook](https://docs.github.com/en/webhooks-and-events/webhooks/creating-webhooks#setting-up-a-webhook)
    - Gitlab: [Webhooks: configure a webhook in GitLab](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#configure-a-webhook-in-gitlab)
1. Trigger the webhook, using the configured source provider event trigger options
1. On the chosen Devopness environment, click `View` in the `Applications` card to see a list of existing `Applications`
1. In the list of applications, find the application you triggered the pipeline and click the `NAME` of the application
1. On the upper-right corner click `DEPLOYMENTS`
1. Click `LOGS` on the action triggered by incoming hook
    > In `START TIME` column, the name of the subject, user or incoming hook, that triggered the action will be visible, e.g: run pipeline 'deploy' on application 'website' using main branch
