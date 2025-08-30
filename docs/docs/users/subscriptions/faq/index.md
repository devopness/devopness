---
title: FAQ
intro:
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

## Is Devopness Free?
All Devopness users and teams get FREE FOREVER access to manage a limited number of projects, environments and resources in any supported cloud provider, and can also deploy application code from `git` repositories hosted in any supported source provider.

All your projects can have teams and users collaborating on it, for FREE.

When your projects grow you may need more deployment options, security controls and collaboration features that may require upgrading to a paid plan.

See also:
- [What Devopness users pay for?](#what-devopness-users-pay-for)
- [Pricing](https://www.devopness.com/pricing/)

## What Devopness users pay for?
You pay for action steps that Devopness executes for you.

As an action running a pipeline can have a variable number of steps, Devopness will charge you by consuming one credit for each action step executed.

Paid plans also differ in the number of premium features available to increase your team's productivity.

See also:
- [What are actions and action steps?](#what-are-actions-and-action-steps)
- [What are credits?](#what-are-credits)
- [Pricing](https://www.devopness.com/pricing/)

## How do I pay?
You can pay inside the Devopness web app.

For detailed instructions, see:
- [/docs/users/subscriptions/upgrade-subscription].

## What are actions and action steps?
An “action” is the execution of a pipeline.

As in our daily routine of managing software projects we need to “take an action” to fix or improve something, that’s exactly what Devopness does for you and your team.

Devopness creates an “action” every time you need to run a pipeline to perform single-step or multi-step operations on resources in your project environments.

Each step in a pipeline becomes an action step, that is then executed by Devopness according to how a pipeline was configured at that point in time.

For your convenience, each action step output log is made available for you in Devopness action details view.

See also:
- [/docs/actions/index]

## What are credits?
Credit is the unit used to pay for each action step Devopness executes for you when running pipelines in your project environments.

## How are credits used by Devopness?
As an action running a pipeline can have a variable number of steps, Devopness will charge the project owner by consuming one credit for each **successful action step completed**.

By default, many actions involve only one step and therefore consume just 1 credit. However, more complex actions—such as large application deployments or pipelines with multiple steps—will require additional credits based on the number of **successful steps** involved.

For example:

- A simple action with one successful step, like a basic task or deployment, will consume **1 credit**.
- A pipeline with 5 successful steps will consume **5 credits**, as one credit is deducted for each successfully completed step.

This ensures that credit consumption reflects the complexity and success of each action.

See also:
- [What are actions and action steps?](#what-are-actions-and-action-steps)
- [What are credits?](#what-are-credits)

## Am I charged for `failed` and `skipped` action steps?
No.
Devopness only consumes credits for successfully completed steps.

While an action step in `pending`, `waiting`, `queued` or `in progress` status, no credit is consumed from your subscription balance.

Also, when steps are not successfully completed for being `skipped` or have `failed` Devopness will not charge you for that action step.

## Are my credits used when contributing to someone else's project?
No.
Only the owner of a project is charged for action steps in their projects.

## How can I see how many credits I have and how many I used?
You can see your total and remaining credits by accessing `Billing and Plans` in your Devopness profile.

For detailed instructions, see:
- [/docs/users/subscriptions/index]

## What happens when I run out of credits?
If you run out of credits you can keep using Devopness to manage your environment resources and all features on your paid plans will remain accessible.

However, new actions will still be created with status `failed`.
Those actions will not be executed and you will see the error message below:
```
Insufficient credits to run this action
```

When that happens, you can fix the error by adding more credits to your account.

For more information, see:
- [How do I add credits to my account?](#how-do-i-add-credits-to-my-account)

## How do I add credits to my account?
To add credits to your account, [/docs/users/subscriptions/upgrade-subscription].

## When is my subscription renewed?
Monthly. The exact date may vary as months have different number of days. We currently renew subscriptions every 30 days from the day an account subscription was updated, upgraded or downgraded

## What happens if my subscription cannot be renewed?
Subscriptions are renewed automatically on their expiry date, using your chosen payment method.

If for some reason your subscription could not be renewed, the current subscription will be canceled.

See also:
- [What happens after my subscription is canceled?](#what-happens-after-my-subscription-is-canceled)

## How do I cancel my subscription?
Subscriptions on Devopness are for an indefinite term, unless you unsubscribe.

Upon cancellation, your subscription will remain active and its credits can be used until the end of the current paid term.

See also:
- [/docs/users/subscriptions/cancel-subscription]
- [What happens after my subscription is canceled?](#what-happens-after-my-subscription-is-canceled)

## What happens after my subscription is canceled?
When your subscription is canceled you’ll still be able to use your subscription exclusive features and remaining credits for the time you’ve already paid for.

For example, if you buy a monthly subscription on January 10 and decide to cancel it on January 20:
- You’ll have access to the subscription features and credits until February 9 (30 days after initial purchase);
- You won’t be charged another monthly subscription on February 9.

A few things will happen:
1. Your subscription will be downgraded to the FREE plan;
2. You can still access action details and action steps output logs, but limited to actions created in the last 24 hours;
3. In environments using custom [/docs/roles/index] in their [/docs/team-memberships/index], the membership will be updated to use the role “Read”, converting all users to read-only users.

But don’t worry: your data will not be lost and your configurations, including team membership roles, will be restored once you update your payment methods and upgrade again to a paid plan.
