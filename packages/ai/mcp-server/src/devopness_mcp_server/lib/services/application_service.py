from typing import Any, List

from mcp.server.fastmcp import Context

from devopness.models import (
    Action,
    Application,
    ApplicationEnvironmentCreate,
    ApplicationRelation,
    PipelineRelation,
    SourceTypePlain,
)

from ..devopness_api import devopness, ensure_authenticated
from ..response import MCPResponse


class ApplicationService:
    @staticmethod
    async def tool_list_applications(
        environment_id: int,
    ) -> List[ApplicationRelation]:
        await ensure_authenticated()
        response = await devopness.applications.list_environment_applications(
            environment_id
        )

        return response.data

    @staticmethod
    async def tool_list_application_pipelines(
        application_id: int,
    ) -> List[PipelineRelation]:
        await ensure_authenticated()
        response = await devopness.pipelines.list_pipelines_by_resource_type(
            application_id, "application"
        )

        return response.data

    @staticmethod
    async def tool_create_application(
        environment_id: int,
        application_input_settings: ApplicationEnvironmentCreate,
    ) -> Application:
        await ensure_authenticated()
        response = await devopness.applications.add_environment_application(
            environment_id,
            application_input_settings,
        )

        return response.data

    @staticmethod
    async def tool_deploy_application(
        ctx: Context[Any, Any],
        source_value: str,
        pipeline_id: int | None = None,
        application_id: int | None = None,
        source_type: SourceTypePlain = "branch",
    ) -> MCPResponse[Action]:
        """
        Trigger a new deployment for application.

        You Should:
        - Use this function when you want to trigger a deployment.
        - If the user provides a pipeline ID, use it to trigger the deployment.
        - If the user does not provide a pipeline ID but provides an application ID,
          use this tool to fetch the available deployment pipelines for the application.
        - You MUST ask the user to provide a source value (e.g., branch name, commit)
          depending on the selected source type (e.g., "branch" or "commit").
        - You MUST confirm with the user all the values that will be used before calling
          this tool with the pipeline_id
        """
        await ensure_authenticated()

        if not pipeline_id:
            if not application_id:
                return MCPResponse.error(
                    [
                        "A pipeline ID or an application ID is required to trigger"
                        " a deployment. Please ask the user to provide one of them."
                    ]
                )

            response_pipelines = (
                await ApplicationService.devopness_list_application_pipelines(
                    application_id
                )
            )

            deploy_pipelines = [
                pipeline
                for pipeline in response_pipelines
                if pipeline.operation == "deploy"
            ]

            if len(deploy_pipelines) == 0:
                return MCPResponse.error(
                    [
                        "No pipelines were found for the given application ID. "
                        "Please ask the user to verify the application and try again."
                    ]
                )

            return MCPResponse.warning(
                [
                    "The following pipelines were found for this application:",
                    deploy_pipelines,
                    "Please ask the user to choose one of the listed pipeline IDs. "
                    "Then call this function again with the selected ID as the "
                    "'pipeline_id' argument.",
                ],
            )

        response = await devopness.actions.add_pipeline_action(
            pipeline_id,
            {
                "source_type": source_type,
                "source_ref": source_value,
            },
        )

        await ctx.info(
            f"Deployment has been triggered using pipeline ID {pipeline_id} "
            f"with source type '{source_type}' and source value '{source_value}'."
        )

        await ctx.info(
            "To monitor the deployment progress, visit the following URL:\n"
            f"{response.data.url_web_permalink}"
        )

        return MCPResponse[Action].ok(
            response.data,
            [
                "To monitor the deployment progress, visit the following URL:",
                response.data.url_web_permalink,
                "Explain to the user how to monitor the deployment progress.",
                "Show the main information's about the action.",
            ],
        )
