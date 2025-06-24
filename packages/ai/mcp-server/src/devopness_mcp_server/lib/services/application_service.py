from typing import Annotated, List, Optional

from pydantic import Field, StringConstraints

from devopness.models import (
    LanguageRuntime,
    SourceTypePlain,
    Variable,
)

from ..devopness_api import devopness, ensure_authenticated
from ..models import ActionSummary, ApplicationSummary
from ..response import MCPResponse
from ..types import MAX_RESOURCES_PER_PAGE, ExtraData, TypeListServerID
from ..utils import (
    get_instructions_choose_resource,
    get_instructions_format_list,
    get_instructions_format_resource,
    get_instructions_how_to_monitor_action,
    get_instructions_next_action_suggestion,
    get_web_link_to_environment_resource,
)


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
                get_instructions_format_list(
                    "#N. {runtime.name_human_readable}",
                    [
                        "Versions:",
                        "- {version for item in runtime.engine_versions}",
                        "Frameworks:",
                        "- {name_human_readable for item in runtime.frameworks}",
                    ],
                )
            ],
        )

    @staticmethod
    async def tool_list_applications(
        project_id: int,
        environment_id: int,
        page: int = Field(
            default=1,
            gt=0,
        ),
    ) -> MCPResponse[List[ApplicationSummary]]:
        await ensure_authenticated()

        response = await devopness.applications.list_environment_applications(
            environment_id,
            page,
            per_page=MAX_RESOURCES_PER_PAGE,
        )

        applications = [
            ApplicationSummary.from_sdk_model(
                application,
                ExtraData(
                    url_web_permalink=get_web_link_to_environment_resource(
                        project_id,
                        environment_id,
                        "application",
                        application.id,
                    ),
                ),
            )
            for application in response.data
        ]

        return MCPResponse.ok(
            applications,
            [
                get_instructions_format_list(
                    "- [{application.name}]({application.url_web_permalink})"
                    " (ID: {application.id})",
                    [
                        "- Repository: {application.repository}",
                        "- Root directory: {application.root_directory}",
                        "- Stack: {application.programming_language}"
                        " {application.programming_language_version}"
                        " ({application.programming_language_framework})",
                        "- Commands:",
                        "  - Install: {application.install_dependencies_command}",
                        "  - Build: {application.build_command}",
                    ],
                ),
                f"Founded {len(applications)} applications.",
                get_instructions_choose_resource("application"),
                get_instructions_next_action_suggestion("deploy", "application"),
            ],
        )

    @staticmethod
    async def tool_create_application(
        project_id: int,
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
        deployments_keep: int = 4,
    ) -> MCPResponse[ApplicationSummary]:
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

        application = ApplicationSummary.from_sdk_model(response.data)

        return MCPResponse.ok(
            application,
            [
                get_instructions_format_resource(
                    "application",
                    [
                        "Name: {application.name}",
                        "Repository: {application.repository}",
                        "Root directory: {application.root_directory}",
                        "Stack:",
                        "- Language: {application.programming_language}",
                        "- Version: {application.programming_language_version}",
                        "- Framework: {application.programming_language_framework}",
                        "Commands:",
                        "- Install: {application.install_dependencies_command}",
                        "- Build: {application.build_command}",
                    ],
                ),
                "See more details at: "
                + get_web_link_to_environment_resource(
                    project_id,
                    environment_id,
                    "application",
                    response.data.id,
                ),
                get_instructions_next_action_suggestion("deploy", "application"),
            ],
        )

    @staticmethod
    async def tool_deploy_application(
        pipeline_id: int,
        source_type: SourceTypePlain,
        source_value: str,
        server_ids: TypeListServerID,
    ) -> MCPResponse[ActionSummary]:
        await ensure_authenticated()

        response = await devopness.actions.add_pipeline_action(
            pipeline_id,
            {
                "source_type": source_type,
                "source_ref": source_value,
                "servers": server_ids,
            },
        )

        action = ActionSummary.from_sdk_model(response.data)

        return MCPResponse.ok(
            action,
            [
                get_instructions_how_to_monitor_action(action.url_web_permalink),
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

        return MCPResponse.ok(
            response.data,
            [
                get_instructions_next_action_suggestion("deploy", "application"),
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

        return MCPResponse.ok(
            response.data,
            [
                get_instructions_next_action_suggestion("deploy", "application"),
            ],
        )
