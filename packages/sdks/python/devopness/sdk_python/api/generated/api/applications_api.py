from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from .models.application import Application
from .models.application_environment_create import ApplicationEnvironmentCreate
from .models.application_relation import ApplicationRelation
from .models.application_update import ApplicationUpdate
from .models.deployment_application_create import DeploymentApplicationCreate

from packages.sdks.python.devopness.sdk_python.common import ApiResponse
from packages.sdks.python.devopness.sdk_python.services import ApiBaseService


class ApplicationsApiService(ApiBaseService):
    """
    ApplicationsApiService - Auto Generated
    """

    async def add_application_deployment(
        self,
        application_id: int,
        deployment_application_create: DeploymentApplicationCreate,
    ) -> ApiResponse:
        """
        Trigger a new deployment for current application
        """

        endpoint: str = f"/applications/{application_id}/deployments"

        response = await self.post(endpoint, deployment_application_create)

        return ApiResponse(response)

    async def add_environment_application(
        self,
        environment_id: int,
        application_environment_create: ApplicationEnvironmentCreate,
    ) -> ApiResponse[Application]:
        """
        Create a new application
        """

        endpoint: str = f"/environments/{environment_id}/applications"

        response = await self.post(endpoint, application_environment_create)

        return ApiResponse(response)

    async def delete_application(
        self,
        application_id: int,
    ) -> ApiResponse:
        """
        Delete a given application
        """

        endpoint: str = f"/applications/{application_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_application(
        self,
        application_id: int,
    ) -> ApiResponse[Application]:
        """
        Get an application by ID
        """

        endpoint: str = f"/applications/{application_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_environment_applications(
        self,
        environment_id: int,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[ApplicationRelation]]:
        """
        Return a list of all Applications belonging to an environment
        """

        endpoint: str = f"/environments/{environment_id}/applications"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_application(
        self,
        application_id: int,
        application_update: ApplicationUpdate,
    ) -> ApiResponse:
        """
        Update an existing application
        """

        endpoint: str = f"/applications/{application_id}"

        response = await self.put(endpoint, application_update)

        return ApiResponse(response)
