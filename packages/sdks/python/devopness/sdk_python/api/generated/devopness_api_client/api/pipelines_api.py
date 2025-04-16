from pydantic import Field, StrictStr
from typing import List, Optional
from typing_extensions import Annotated
from devopness_api_client.models.pipeline import Pipeline
from devopness_api_client.models.pipeline_create import PipelineCreate
from devopness_api_client.models.pipeline_relation import PipelineRelation
from devopness_api_client.models.pipeline_update import PipelineUpdate

from packages.sdks.python.devopness.common.api_response import ApiResponse
from packages.sdks.python.devopness.services.api_base_service import ApiBaseService


class PipelinesApiService(ApiBaseService):
    """
    PipelinesApiService - Auto Generated
    """

    async def add_pipeline(
        self,
        resource_id: int,
        resource_type: str,
        pipeline_create: PipelineCreate,
    ) -> ApiResponse[Pipeline]:
        """
        Add a Pipeline to a resource
        """

        endpoint: str = f"/pipelines/{resource_type}/{resource_id}"f"/pipelines/{resource_type}/{resource_id}"

        response = await self.post(endpoint, pipeline_create)

        return ApiResponse(response)

    async def delete_pipeline(
        self,
        pipeline_id: int,
    ) -> ApiResponse:
        """
        Delete a given Pipeline
        """

        endpoint: str = f"/pipelines/{pipeline_id}"

        response = await self.delete(endpoint)

        return ApiResponse(response)

    async def get_pipeline(
        self,
        pipeline_id: int,
    ) -> ApiResponse[Pipeline]:
        """
        Get a Pipeline by ID
        """

        endpoint: str = f"/pipelines/{pipeline_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def list_pipelines_by_resource_type(
        self,
        resource_id: int,
        resource_type: str,
        page: int = None,
        per_page: int = None,
    ) -> ApiResponse[List[PipelineRelation]]:
        """
        Return a list of pipelines to a resource
        """

        endpoint: str = f"/pipelines/{resource_type}/{resource_id}"f"/pipelines/{resource_type}/{resource_id}"

        response = await self.get(endpoint)

        return ApiResponse(response)

    async def update_pipeline(
        self,
        pipeline_id: int,
        pipeline_update: PipelineUpdate,
    ) -> ApiResponse:
        """
        Update an existing Pipeline
        """

        endpoint: str = f"/pipelines/{pipeline_id}"

        response = await self.put(endpoint, pipeline_update)

        return ApiResponse(response)
