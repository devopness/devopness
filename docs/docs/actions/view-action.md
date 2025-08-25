---
title: View details of an Action
intro: In this section you will learn how to find and understand details of a Devopness action
links:
    overview:
    quickstart:
    previous: actions/index
    next: api/index
    guides:
    related:
        - actions/index
    featured:
---

You can access details of all actions executed in an environment to which you have access.

1. On Devopness, navigate to a project then select an environment
1. On the upper-right corner, click `ACTIONS` to see a list of all actions created in the current environment
1. In the list of actions, find the action you want to inspect and click the link in the `ACTION` column
    > You will be redirected to the action details view
1. In the action details view, the header displays:
    - `Status`
    - `Status reason`: a detailed explanation of why the action is in the current `Status`
    - The resource type (e.g.: `Application`, `Server`, `Service`, ...) to which the action was created
    - The operation being executed for that resource type (e.g.: `Deploy`, `Start`, `Stop`, ...)
    - The name of the environment in which that action was created
    - The start time
    - The user, or automated webhook, who triggered the action
1. An action can have one or more targets. Find a target/server and the action step you want to inspect and click `LOGS`
1. A text area will be displayed containing the output log of the action step execution
