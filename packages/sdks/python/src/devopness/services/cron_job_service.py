"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.cron_jobs_api import (
    CronJobsApiService,
    CronJobsApiServiceAsync,
)

__all__ = ["CronJobService", "CronJobServiceAsync"]


class CronJobService(
    CronJobsApiService,
):
    """Service for cron jobs in the Devopness API."""


class CronJobServiceAsync(
    CronJobsApiServiceAsync,
):
    """Async service for cron jobs in the Devopness API."""
