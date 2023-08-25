---
title: Check Server Provision Logs
intro: Sometimes you may encounter problems while provisioning your servers. Check your server' actions logs to evaluate what happened.
links:
    overview:
    quickstart:
    previous:
        - /docs/servers/add-server
    next:
        - /docs/servers/ssh-into-server
    guides:
    related:
    featured:
required_permissions:
    - server:read
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Servers` card
1. Click the `View` in the `Servers` card
1. On the upper-right corner, click `ACTIONS` to see a list of actions for all `Servers` of the current environment
1. In the list of actions, find the action you want to inspect and click `LOGS` to see the list of action steps
    > There are 3 actions related to the server provision process: `Provision`, `Provision-check` and `Add`;
    > each action can have one of the following status: `Queued`, `Pending`, `In progress`, `Completed` or `Failed`.
1. In the action details view, find the server and the action step you want to inspect and click `LOGS`
1. A text area will be displayed containing the output log of the action step execution
