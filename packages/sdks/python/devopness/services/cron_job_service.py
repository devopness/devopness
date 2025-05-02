"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.cron_jobs_api import CronJobsApiService

__all__ = ["CronJobService"]

# pylint: disable=missing-class-docstring


class CronJobService(
    CronJobsApiService,
):
    """Service for cron jobs in the Devopness API."""
