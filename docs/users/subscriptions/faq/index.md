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
All Devopness users and teams get FREE FOREVER access to manage an unlimited number of projects, environments and resources in any supported cloud provider, and can also deploy applications from any supported source provider.

All your projects can have an unlimited number of users collaborating on it, for FREE.

When your projects grow you may need more deployment options, security controls and collaboration features that may require upgrading to a paid plan.

See also:
- [Pricing](/pricing/)

## What Devopness users pay for?
You pay for action steps that Devopness executes for you.

As an action running a pipeline can have a variable number of steps, Devopness will charge you by consuming one credit for each action step executed.

See also:
- [What are actions and action steps?](#)
- [What are credits?](#)

## How do I pay?
You can pay inside the Devopness web app. 

For detailed instructions, see:
- {% mentionPost "/docs/users/subscriptions/upgrade-subscription" %}.

## What are actions and action steps?
An “action” is the execution of a pipeline.

As in our daily routine of managing software projects we need to “take an action” to fix or improve something, that’s exactly what Devopness does for you and your team.

Devopness creates an “action” every time you need to run a pipeline to perform single-step or multi-step operations on resources in your project environments.

Each step in a pipeline becomes an action step, that is then executed by Devopness according to how a pipeline was configured at that point in time.

For your convenience, each action step output log is made available for you in Devopness action details view.

See also:
- {% mentionPost "/docs/actions" %}

## What are credits?
Credit is the unit used to pay for each action step Devopness executes for you when running pipelines in your project environments.

## How are credits used by Devopness?
As an action running a pipeline can have a variable number of steps, Devopness will charge the project owner by consuming one credit for each action step completed.

For example:
If an active subscription includes 100 credits and an action is created to run a pipeline with 5 steps, that action will consume 5 credits from the account of the project owner.

After the action is finished, 95 credits will remain available to be used in any project owned by the same user account.

See also:
- [What are actions and action steps?](#)
- [What are credits?](#)

## Am I charged for `failed` and `skipped` action steps?
No.
Devopness only consumes credits for successfully completed steps.

While an action step in `pending`, `waiting`, `queued` or `in progress` status, no credit is consumed from your subscription balance.

Also, when steps are not successfully completed for being `skipped` or have `failed`  Devopness will not charge you for that action step.

## Are my credits used when contributing to someone else's project?
No.
Only the owner of a project is charged for action steps in their projects.

## How can I see how many credits I have and how many I used?
You can see your total and remaining credits by accessing `Billing and Plans` in your Devopness profile.

For detailed instructions, see:
- {% mentionPost "/docs/users/subscriptions" %}

## What happens when I run out of credits?
If you run out of credits you can keep using Devopness to manage your environment resources and all features on your paid plans will remain accessible.

However, new actions will not be created in your projects until you add credits to your account. 

For more information, see:
- [How do I add credits to my account?](#)

## How do I add credits to my account?
To add credits to your account, {% mentionPost "/docs/users/subscriptions/upgrade-subscription" %}.

## When is my subscription renewed?
Monthly. The exact date may vary as months have different number of days. We currently renew subscriptions every 30 days from the day an account subscription was updated, upgraded or downgraded

## What happens if my subscription cannot be renewed?
Subscriptions are renewed automatically on their expiry date, using your chosen payment method.

If for some reason your subscription could not be renewed, the current subscription will be canceled. 

See also:
- [What happens after my subscription is canceled?](#)

## How do I cancel my subscription?
Subscriptions on Devopness are for an indefinite term, unless you unsubscribe.

Upon cancellation, your subscription will remain active and its credits can be used until the end of the current paid term.

See also:
- {% mentionPost "/docs/users/subscriptions/cancel-subscription" %}
- [What happens after my subscription is canceled?](#)

## What happens after my subscription is canceled?
When your subscription is canceled you’ll still be able to use your subscription exclusive features and remaining credits for the time you’ve already paid for.

For example, if you buy a monthly subscription on January 10 and decide to cancel it on January 20:
- You’ll have access to the subscription features and credits until February 9 (30 days after initial purchase);
- You won’t be charged another monthly subscription on February 9.

A few things will happen:
1. Your subscription will be downgraded to the FREE plan;
2. You can still access action details and action steps output logs, but limited to actions created in the last 24 hours;
3. In environments using custom {% mentionPost "/docs/roles" %} in their {% mentionPost "/docs/environments/team-memberships" %}, the membership will be updated to use the role “Read”, converting all users to read-only users.

But don’t worry: your data will not be lost and your configurations, including team membership roles, will be restored once you update your payment methods and upgrade again to a paid plan.
