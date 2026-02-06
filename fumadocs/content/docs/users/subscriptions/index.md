---
title: Billing and Plans
intro: Learn how to manage your subscription plan on Devopness.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
        - users/subscriptions/upgrade-subscription
        - users/subscriptions/cancel-subscription
    featured:
---

## About billing for Devopness plans and actions
Devopness usage is free for everyone, without any limits on the amount of projects, environments or the amount of resources that can be added to each project environment.

Paid subscription plans are available for users and teams who want to increase their productivity by taking the most of Devopness additional features.

Independently of the subscription plan of a Devopness project, the main usage is controlled by credits.

:::note

Devopness consumes one credit per completed action step when running a pipeline

:::

Each Devopness user account receives a certain amount of credits monthly, depending on the user’s active subscription plan.

Credits are consumed from the project owner’s account: if you are collaborating on somebody else’s project as a team member, but you’re not the owner of that project, then your credits will not be consumed when working on that project.

For details, see Usage limits and our [/docs/users/subscriptions/faq/index]

## Billing date and subscription renewal
You can view your account's subscription details, payment history and your next billing date in your account's billing settings at [/docs/users/subscriptions/upgrade-subscription]

## Billing settings
You can manage your billing settings, such as subscription plans and payment methods in your account's billing settings at [/docs/users/subscriptions/upgrade-subscription]

## Overages
At the moment Devopness does not allow usage-based billing, so user projects cannot consume more credits than the amount included in the user’s active subscription plan.

There will be no surprises in your monthly or annual billing, as Devopness will charge you upfront for the included amounts of credits in your subscription plan.

You can see the amount of credits included in your account's billing settings at Billing & Plans

## Usage limits
There are some limits when using Devopness actions, depending on the subscription plan.
These limits are subject to change every time our plans are updated. For details, see our [pricing page](https://www.devopness.com/pricing/)

Below you have a table with the current applied limits, per plan, followed by an explanation on the impact of each limit:
|                                                             | Free       | Standard             |
|:-------------------------------------------------------------|:-----------|:---------------------|
| **Max parallel actions, per server**                         | 1          | 10                   |
| **Max parallel actions, per pipeline**                       | 1          | 10                   |
| **Max amount of time an action step log remains accessible** | 24 hours   | 90 days              |
| **Max execution time, per action step**                      | 10 minutes | 15 minutes           |
| **Max API requests, per minute**                             | 30         | 120                  |

- **Max parallel actions, per server**: Users can control how many actions can run simultaneously on each server, so the server resources are used the way that is most suitable for each user environment

- **Max parallel actions, per pipeline**: User pipelines may run custom action steps that could lead to race conditions if executed concurrently. Devopness allows user to define which pipelines can have multiple actions executing it at the same time and how many parallel actions are allowed to be started running that pipeline.

- **Max execution time, per action step**: Each pipeline step executed by an action can run for up to 15 minutes of execution time. If an action step reaches this limit, the step is moved to the “failed” status and the action fails to complete.

## Usage policy
In addition to the usage limits, you must ensure that you use Devopness within our [/docs/legal/terms-of-service]
