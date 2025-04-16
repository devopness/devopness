from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.cron_job import CronJob
from devopness_api_client.models.cron_job_environment_create import CronJobEnvironmentCreate
from devopness_api_client.models.cron_job_relation import CronJobRelation
from devopness_api_client.models.cron_job_update import CronJobUpdate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class CronJobsApiService(ApiBaseService):
    """
    CronJobsApiService - Auto Generated
    """

    async def add_environment_cron_job(
        self,
        environment_id: int,
        cron_job_environment_create: CronJobEnvironmentCreate,
    ) -> ApiResponse[CronJob]:
        """
        Add a Cron Job to the given environment
        """

        endpoint: str = f"/environments/{environment_id}/cron-jobs"

        response = await self.post(endpoint, cron_job_environment_create)

        return ApiResponse(response)

    async def delete_cron_job(
        self,
        cron_job_id: int,
    ) -> ApiResponse:
        """
        Delete a given Cron Job
        """

        endpoint: str = f"/cron-jobs/{cron_job_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_cron_job(
        self,
        cron_job_id: int,
    ) -> ApiResponse[CronJob]:
        """
        Get a Cron Job by ID
        """

        endpoint: str = f"/cron-jobs/{cron_job_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_environment_cron_jobs(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[CronJobRelation]]:
        """
        Return a list of all Cron Jobs belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/cron-jobs"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_cron_job(
        self,
        cron_job_id: int,
        cron_job_update: CronJobUpdate,
    ) -> ApiResponse:
        """
        Update an existing Cron Job
        """

        endpoint: str = f"/cron-jobs/{cron_job_id}"

        response = await self.put(endpoint, cron_job_update)

        return ApiResponse(response)
