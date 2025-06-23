from typing import Annotated, Any, List, Optional

from mcp.server.fastmcp import Context
from pydantic import Field, StringConstraints

from devopness.models import (
    Action,
    Application,
    ApplicationRelation,
    LanguageRuntime,
    PipelineRelation,
    SourceTypePlain,
    Variable,
)

from ..devopness_api import devopness, ensure_authenticated
from ..response import MCPResponse


class ApplicationService:
    @staticmethod
    async def tool_get_available_language_runtimes() -> MCPResponse[
        List[LanguageRuntime]
    ]:
        await ensure_authenticated()

        response = await devopness.static.get_static_application_options()

        runtimes = response.data.language_runtimes

        return MCPResponse.ok(
            runtimes,
            [
                "Show the list of available language runtimes.",
                "You MUST guide the user to select a programming language "
                "based in current information's about the application and "
                "application repository.",
            ],
        )

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
        source_credential_id: int,
        name: Annotated[
            str,
            StringConstraints(
                max_length=60,
                pattern=r"^[a-z0-9\.\-\_]+$",
            ),
        ],
        repository: Annotated[
            str,
            StringConstraints(
                max_length=100,
                pattern=r"^[\w.-]+[\/][\w.-]+$",
            ),
            Field(description="Expecting a repository in the format 'owner/repo'."),
        ],
        programming_language: str,
        programming_language_version: str,
        programming_language_framework: str,
        root_directory: Optional[
            Annotated[
                str,
                StringConstraints(
                    # Required to start with a slash
                    pattern=r"^/.*$",
                ),
            ]
        ],
        build_command: Optional[str],
        install_dependencies_command: Optional[str],
        default_branch: str,
        deployments_keep: Optional[int],
    ) -> MCPResponse[Application]:
        """
        Rules:
        - The source_credential_id must be of the source provider where the repository
           is hosted. You MUST ensure the user has selected the correct credential
           if user provided the link to the repository. Eg: https://github.com/devopness/devopness
           should use a GitHub credential.
        - If the environment selected by the user does not have a credential of the
           source provider where the repository is hosted, you MUST inform the user
           that they need to create a credential for that source provider in the
           selected environment.
           Please guide the user to access the url
           https://app.devopness.com/projects/<project_id>/environments/<environment_id>/credentials/add
        - Use the `devopness_get_available_language_runtimes` tool help the user to
           select the programming language, version and framework for the new
           application.
        - If the user does not provide an engine version, assume the latest version
           available for the programming language.
        """
        await ensure_authenticated()
        response = await devopness.applications.add_environment_application(
            environment_id,
            {
                "credential_id": source_credential_id,
                "name": name,
                "repository": repository,
                "programming_language": programming_language,
                "engine_version": programming_language_version,
                "framework": programming_language_framework,
                "root_directory": root_directory,
                "build_command": build_command,
                "install_dependencies_command": install_dependencies_command,
                "default_branch": default_branch,
                "deployments_keep": deployments_keep,
            },
        )

        return MCPResponse[Application].ok(
            response.data,
            [
                "Inform the user that the application has been created.",
                "Show the main information's about the application.",
                "Show the following link to the application in the Devopness App: "
                f"https://app.devopness.com/projects/{response.data.project_id}/environments/{environment_id}/applications/{response.data.id}",
                "You MUST suggest the user to deploy the created application.",
            ],
        )

    @staticmethod
    async def tool_deploy_application(
        ctx: Context[Any, Any],
        source_value: str,
        server_ids: List[int],
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
                await ApplicationService.tool_list_application_pipelines(application_id)
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
                "servers": server_ids,
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
                "To monitor the deployment progress, display to the user the following"
                " URL as a clickable link:" + response.data.url_web_permalink,
                "Explain to the user how to monitor the deployment progress.",
                "Show the main information's about the action.",
            ],
        )

    @staticmethod
    async def tool_create_application_variable(
        application_id: int,
        variable_name: Annotated[
            str,
            StringConstraints(
                # Define a POSIX-compliant pattern for environment variable names.
                # See: https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap08.html
                pattern=r"^[a-zA-Z_][a-zA-Z0-9_]*$",
            ),
        ],
        variable_value: str,
        variable_is_secret: bool = False,
        variable_description: Optional[str] = None,
    ) -> MCPResponse[Variable]:
        await ensure_authenticated()

        response = await devopness.variables.add_variable(
            application_id,
            "application",
            {
                "key": variable_name,
                "value": variable_value,
                "type": "variable",
                "target": "os-env-var",
                "hidden": variable_is_secret,
                "description": variable_description,
            },
        )

        return MCPResponse[Variable].ok(
            response.data,
            [
                "Inform the user that the variable has been created.",
            ],
        )

    @staticmethod
    async def tool_create_application_config_file(
        application_id: int,
        file_path: Annotated[
            str,
            Field(
                description="The path to the configuration file,"
                "relative to the application directory.",
                examples=[
                    ".env",
                    "config.json",
                    "config/database.yml",
                ],
            ),
        ],
        file_content: str,
        file_description: Optional[str] = None,
    ) -> MCPResponse[Variable]:
        await ensure_authenticated()

        response = await devopness.variables.add_variable(
            application_id,
            "application",
            {
                "key": file_path,
                "value": file_content,
                "type": "file",
                "target": "resource-config-file",
                "hidden": False,
                "description": file_description,
            },
        )

        return MCPResponse[Variable].ok(
            response.data,
            [
                "Inform the user that the configuration file has been created.",
            ],
        )
