---
title: Add a Cron Job
links:
  overview:
  quickstart:
  previous:
  next: cronjobs/edit-cronjob
  guides:
    related:
  featured:
required_permissions:
  - cronjob:create
---

Add a cron job to run a recurring task.

## Goal

Automate a schedule-based operation safely from the UI.

## Steps

1. Open the environment where the job should run
2. Open the `Cron Jobs` card
3. Click `View`
4. Click `ADD CRON JOB`
5. Set name, schedule, and command
6. Save

## Expected result

- The new cron job appears in the cron jobs list
- The schedule starts according to the defined interval

## Common issues

- Missing permissions for cron jobs
- Invalid cron expression
- Job command references unavailable resource
