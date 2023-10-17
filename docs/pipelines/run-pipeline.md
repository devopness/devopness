---
title: Run a Pipeline
intro: Run a deploy pipeline to apply a network rule to a server.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
required_permissions:
    - network-rule:deploy
---

{% note %}

**NOTE**: A network rule and deploy pipeline were chosen as examples, the steps are the same to run pipelines of all operations in all environment's modules

{% endnote %}

1. On Devopness, navigate to a project then select an environment
1. Find the `Network Rules` card
1. Click `View` in the `Network Rules` card to see a list of existing `Network Rules`
1. Click `DETAILS` on the network rule you want to run a pipeline
1. On the upper-right corner of the network rule details view, click `SETTINGS`
1. Use the drop-down menu to choose `PIPELINES`, to see a list of existing `Pipelines`
1. In the list of pipelines, find the deploy pipeline you want to run and click `DEPLOY`
1. Follow the prompts then click `DEPLOY`
    - The form confirm button will be labeled according to the pipeline operation

    {% note %}

    **NOTE**: To run a deploy pipeline at least one server must be linked to the resource.

    If there are no servers linked to the network rule, follow the guide [Add a Linked Resource](/docs/linked-resources/add-linked-resource)

    {% endnote %}

1. Wait for the action `Network-rule:Deploy` to be completed
