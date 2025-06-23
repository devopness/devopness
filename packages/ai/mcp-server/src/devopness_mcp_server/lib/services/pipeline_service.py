from typing import List

from ..devopness_api import devopness, ensure_authenticated
from ..models import PipelineSummary, ResourceType
from ..response import MCPResponse
from ..utils import (
    get_format_list_instructions,
    get_next_action_suggestion_instructions,
)


class PipelineService:
    @staticmethod
    async def tool_get_resource_pipelines(
        resource_id: int,
        resource_type: ResourceType,
    ) -> MCPResponse[List[PipelineSummary]]:
        await ensure_authenticated()
        response = await devopness.pipelines.list_pipelines_by_resource_type(
            resource_id,
            resource_type,
        )

        pipelines = [
            PipelineSummary.from_sdk_model(pipeline) for pipeline in response.data
        ]

        return MCPResponse.ok(
            pipelines,
            [
                get_format_list_instructions(
                    "#N. {pipeline.name} (ID: {pipeline.id})",
                    [
                        "Operation: {pipeline.operation}",
                    ],
                ),
                get_next_action_suggestion_instructions(
                    "deploy",
                    resource_type,
                ),
            ],
        )
