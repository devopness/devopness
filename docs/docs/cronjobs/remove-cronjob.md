---
title: Remove a Cron Job
links:
  overview:
  quickstart:
  previous: cronjobs/edit-cronjob
  next:
  guides: []
  featured:
required_permissions:
  - cronjob:delete
---

Remove a cron job when you no longer need scheduled execution.

## Goal

Stop and delete a recurring automation cleanly.

## Steps

1. Open the environment with the cron job
2. Open `Cron Jobs`
3. Open the cron job to remove
4. Click `REMOVE`
5. Confirm `REMOVE CRON JOB`

## Expected result

- The cron job disappears from the list
- No new executions will be scheduled from this job

## Common issues

- You cannot remove the job: confirm delete permissions
- Removal is blocked because of background state
