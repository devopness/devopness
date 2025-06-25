from typing import Annotated, List

from pydantic import StringConstraints

from ..devopness_api import devopness, ensure_authenticated
from ..models import PipelineStepSummary, PipelineSummary
from ..response import MCPResponse
from ..types import ResourceType
from ..utils import (
    get_instructions_format_list,
    get_instructions_next_action_suggestion,
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
                get_instructions_format_list(
                    "- {pipeline.name} (ID: {pipeline.id})",
                    [
                        "Operation: {pipeline.operation}",
                    ],
                ),
                get_instructions_next_action_suggestion(
                    "deploy",
                    resource_type,
                ),
            ],
        )

    @staticmethod
    async def tool_list_pipeline_steps(
        pipeline_id: int,
    ) -> MCPResponse[List[PipelineStepSummary]]:
        await ensure_authenticated()

        response = await devopness.pipelines.get_pipeline(pipeline_id)

        pipeline_steps = [
            PipelineStepSummary.from_sdk_model(step) for step in response.data.steps
        ]

        return MCPResponse.ok(
            pipeline_steps,
            [
                get_instructions_format_list(
                    "- **{pipeline_step.name}** "
                    "IF {pipeline_step.is_auto_generated} "
                    "ELSE {pipeline_step.name} `{pipeline_step.command}` "
                    "(ID: {pipeline_step.id}, Order: {pipeline_step.trigger_order})",
                ),
                get_instructions_next_action_suggestion(
                    "deploy",
                    response.data.resource_type.value,  # type: ignore
                ),
            ],
        )

    @staticmethod
    async def tool_create_pipeline_step(
        pipeline_id: int,
        name: Annotated[
            str,
            StringConstraints(
                min_length=4,
                max_length=60,
            ),
        ],
        command: Annotated[
            str,
            StringConstraints(
                min_length=10,
                max_length=300,
            ),
        ],
        trigger_after_step_id: int,
    ) -> MCPResponse[List[PipelineStepSummary]]:
        await ensure_authenticated()

        pipeline_steps = await PipelineService.tool_list_pipeline_steps(pipeline_id)

        trigger_after_step = next(
            (
                step
                for step in pipeline_steps.data or []
                if step.id == trigger_after_step_id
            ),
            None,
        )

        if trigger_after_step is None:
            return MCPResponse.error(
                [
                    f"Pipeline step with id {trigger_after_step_id} not found.",
                    "You MUST list the pipeline steps and ask the user to choose"
                    " the step after which the new pipeline step will run.",
                ],
            )

        response = await devopness.pipelines.add_pipeline_step(
            pipeline_id,
            {
                "name": name,
                "command": command,
                "type": "pipeline-step",
                "runner": "custom",
                "run_as_user": "devopness",
            },
        )

        await devopness.pipelines.update_pipeline_step(
            pipeline_id,
            response.data.id,
            {
                "id": response.data.id,
                "command": response.data.command,
                "runner": response.data.runner,
                "trigger_after": trigger_after_step.trigger_order,
            },
        )

        pipeline_steps = await PipelineService.tool_list_pipeline_steps(
            pipeline_id,
        )

        return MCPResponse.ok(
            pipeline_steps.data,
            pipeline_steps.instructions,
        )
