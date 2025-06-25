from typing import Annotated, List

from pydantic import StringConstraints

from ..devopness_api import devopness, ensure_authenticated
from ..models import PipelineStepSummary, PipelineSummary
from ..response import MCPResponse
from ..types import ExtraData, ResourceType
from ..utils import (
    get_instructions_format_table,
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
            PipelineSummary.from_sdk_model(
                pipeline,
                ExtraData(
                    url_web_permalink=(
                        "https://app.devopness.com/"
                        f"projects/{pipeline.project_id}/"
                        f"environments/{pipeline.environment_id}/"
                        f"{resource_type}s/{resource_id}/"
                        f"pipelines/{pipeline.id}"
                    )
                ),
            )
            for pipeline in response.data
        ]

        return MCPResponse.ok(
            pipelines,
            [
                get_instructions_format_table(
                    [
                        (
                            "ID",
                            "{pipeline.id}",
                        ),
                        (
                            "Name",
                            "[{pipeline.name}]({pipeline.url_web_permalink})",
                        ),
                        (
                            "Operation",
                            "{pipeline.operation}",
                        ),
                    ],
                ),
                get_instructions_next_action_suggestion("deploy", resource_type),
            ],
        )

    @staticmethod
    async def tool_list_pipeline_steps(
        pipeline_id: int,
    ) -> MCPResponse[List[PipelineStepSummary]]:
        await ensure_authenticated()

        response = await devopness.pipelines.get_pipeline(pipeline_id)

        pipeline = response.data
        pipeline_steps = [
            PipelineStepSummary.from_sdk_model(
                step,
                ExtraData(
                    url_web_permalink=(
                        "https://app.devopness.com/"
                        f"projects/{pipeline.project_id}/"
                        f"environments/{pipeline.environment_id}/"
                        f"{pipeline.resource_type}s/{pipeline.resource_id}/"
                        f"pipelines/{step.pipeline_id}/"
                        f"steps/{step.id}"
                    )
                ),
            )
            for step in pipeline.steps
        ]

        return MCPResponse.ok(
            pipeline_steps,
            [
                get_instructions_format_table(
                    [
                        (
                            "ID",
                            "{pipeline_step.id}",
                        ),
                        (
                            "Name",
                            "IF {pipeline_step.is_auto_generated}"
                            " THEN **{pipeline_step.name}**"
                            " ELSE [{pipeline_step.name}]({pipeline_step.url_web_permalink})",  # noqa: E501
                        ),
                        (
                            "Command",
                            "IF {pipeline_step.is_auto_generated}"
                            " THEN ``"
                            " ELSE `{pipeline_step.command}`",
                        ),
                    ]
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
