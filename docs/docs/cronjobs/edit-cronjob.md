---
title: Edit a Cron Job
links:
  overview:
  quickstart:
  previous: cronjobs/add-cronjob
  next: cronjobs/remove-cronjob
  guides: []
  featured:
required_permissions:
  - cronjob:update
---

Change schedule, command, or metadata for one cron job.

## Goal

Adjust automation behavior without recreating the job.

## Steps

1. Open the environment with the cron job
2. Open `Cron Jobs`
3. Open the target cron job
4. Click `EDIT`
5. Update settings and confirm

## Expected result

- The cron job reflects the new settings
- Next executions follow the updated schedule

## Common issues

- You do not see edit action: confirm `cronjob:update` permission
- Schedule parse error: verify the cron expression
