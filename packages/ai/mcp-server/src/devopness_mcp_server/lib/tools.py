from typing import Any, List

from mcp.server.fastmcp import Context, FastMCP

from devopness.models import (
    Action,
    ActionPipelineCreatePlain,
    Application,
    ApplicationEnvironmentCreate,
    ApplicationRelation,
    CredentialRelation,
    EnvironmentRelation,
    Hook,
    HookPipelineCreate,
    HookTypeParam,
    PipelineRelation,
    ProjectRelation,
    Server,
    ServerEnvironmentCreate,
    ServerRelation,
    ServiceRelation,
    SourceTypePlain,
    SshKey,
    UserMe,
)

from .devopness_api import devopness, ensure_authenticated
from .response import MCPResponse


def register_tools(mcp_server: FastMCP) -> None:
    """
    Register all Devopness tools that will be made available for the MCP server.
    """

    mcp_server.add_tool(devopness_get_user_profile)
    mcp_server.add_tool(devopness_list_application_pipelines)
    mcp_server.add_tool(devopness_list_applications)
    mcp_server.add_tool(devopness_list_credentials)
    mcp_server.add_tool(devopness_list_environments)
    mcp_server.add_tool(devopness_list_projects)
    mcp_server.add_tool(devopness_list_servers)
    mcp_server.add_tool(devopness_list_services)

    mcp_server.add_tool(devopness_create_application)
    mcp_server.add_tool(devopness_create_cloud_server)
    mcp_server.add_tool(devopness_create_ssh_key)
    mcp_server.add_tool(devopness_create_webhook)
    mcp_server.add_tool(devopness_deploy_application)
    mcp_server.add_tool(devopness_deploy_ssh_key)


async def devopness_get_user_profile() -> UserMe:
    await ensure_authenticated()
    current_user = await devopness.users.get_user_me()

    return current_user.data


async def devopness_list_projects() -> List[ProjectRelation]:
    await ensure_authenticated()
    response = await devopness.projects.list_projects()

    return response.data


async def devopness_list_environments(project_id: int) -> List[EnvironmentRelation]:
    await ensure_authenticated()
    response = await devopness.environments.list_project_environments(project_id)

    return response.data


async def devopness_list_credentials(environment_id: int) -> List[CredentialRelation]:
    await ensure_authenticated()
    response = await devopness.credentials.list_environment_credentials(environment_id)

    return response.data


async def devopness_list_servers(environment_id: int) -> List[ServerRelation]:
    await ensure_authenticated()
    response = await devopness.servers.list_environment_servers(environment_id)

    return response.data


async def devopness_list_applications(environment_id: int) -> List[ApplicationRelation]:
    await ensure_authenticated()
    response = await devopness.applications.list_environment_applications(
        environment_id
    )

    return response.data


async def devopness_list_application_pipelines(
    application_id: int,
) -> List[PipelineRelation]:
    await ensure_authenticated()
    response = await devopness.pipelines.list_pipelines_by_resource_type(
        application_id, "application"
    )

    return response.data


async def devopness_create_cloud_server(
    environment_id: int,
    server_input_settings: ServerEnvironmentCreate,
) -> Server:
    await ensure_authenticated()
    response = await devopness.servers.add_environment_server(
        environment_id,
        server_input_settings,
    )

    return response.data


async def devopness_create_application(
    environment_id: int,
    application_input_settings: ApplicationEnvironmentCreate,
) -> Application:
    await ensure_authenticated()
    response = await devopness.applications.add_environment_application(
        environment_id,
        application_input_settings,
    )

    return response.data


async def devopness_deploy_application(
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
    - You MUST ask the user to provide a source value (e.g., branch name, commit hash)
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

        response_pipelines = await devopness_list_application_pipelines(application_id)

        deploy_pipelines = [
            pipeline
            for pipeline in response_pipelines
            if pipeline.operation == "deploy"
        ]

        if len(deploy_pipelines) == 0:
            return MCPResponse.error(
                [
                    "No deployment pipelines were found for the given application ID. "
                    "Please ask the user to verify the application and try again."
                ]
            )

        return MCPResponse.warning(
            [
                "The following deployment pipelines were found for this application:",
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


async def devopness_create_webhook(
    pipeline_id: int,
    hook_type: HookTypeParam,
    hook_settings: HookPipelineCreate,
) -> Hook:
    await ensure_authenticated()
    response = await devopness.hooks.add_pipeline_hook(
        hook_type,
        pipeline_id,
        hook_settings,
    )

    return response.data


async def devopness_create_ssh_key(
    environment_id: int,
    name: str,
    public_key: str,
) -> MCPResponse[SshKey]:
    """
    Create a new SSH key and add it to the given environment.

    You Should:
    - Use this function when you want to create a new SSH key.
    - Ask the user for a name for the SSH key. If the user does not provide a name,
      suggest one and ask the user if they accept the suggested name or prefer another.
    - Ask the user for the public key.
    - Explain to the user how to get the public key.
    - If the user asks how to create a new SSH key, ask the user which OS they are using
      and help them create a new SSH key.
    """
    await ensure_authenticated()
    response = await devopness.ssh_keys.add_environment_ssh_key(
        environment_id,
        {
            "name": name,
            "public_key": public_key,
        },
    )

    return MCPResponse[SshKey].ok(
        response.data,
        [
            "SSH key has been successfully created and added to the environment.",
            "Would you like to deploy this SSH key to your servers now?"
            " I can help you with the deployment process using the "
            "devopness_deploy_ssh_key tool.",
            "To proceed, please confirm if you'd like to deploy this key "
            "and specify which servers should have access to it.",
        ],
    )


async def devopness_deploy_ssh_key(
    ctx: Context[Any, Any],
    pipeline_id: int | None = None,
    ssh_key_id: int | None = None,
    server_ids: List[int] | None = None,
) -> MCPResponse[Action]:
    """
    Trigger a new deployment for an SSH key.

    You Should:
        - If the user provides a pipeline ID, use it to trigger the deployment.
        - If the user does not provide a pipeline ID but provides an SSH key ID,
          use this tool to fetch the available deployment pipelines for the SSH key.
        - You MUST ask the user to provide the list of servers to deploy to.
          - You can use the `devopness_list_servers` tool to help the user select
            the servers.
          - The Devopness is able to deploy to multiple servers at the same time.
          - The Devopness is able to deploy to a server that is still being provisioned.
          - If the user does not provide a list of servers, the Devopness will try
            deploy to all servers linked with the SSH key, which may cause errors
            if there are no servers linked with the SSH key.
        - You MUST confirm with the user all the values that will be used before calling
          this tool with the pipeline_id
    """
    await ensure_authenticated()

    if not pipeline_id:
        if not ssh_key_id:
            return MCPResponse.error(
                [
                    "A pipeline ID or an SSH key ID is required to trigger"
                    " a deployment. Please ask the user to provide one of them."
                ]
            )

        response_pipelines = await devopness.pipelines.list_pipelines_by_resource_type(
            ssh_key_id,
            "ssh-key",
        )

        if len(response_pipelines.data) == 0:
            return MCPResponse.error(
                [
                    "No deployment pipelines were found for the given SSH key ID. "
                    "Please ask the user to verify the SSH key and try again."
                ]
            )

        return MCPResponse.warning(
            [
                "The following deployment pipelines were found for this SSH key:",
                response_pipelines.data,
                "Please ask the user to choose one of the listed pipeline IDs.",
                "Then call this function again with the selected ID as the"
                " 'pipeline_id' argument.",
            ]
        )

    action_pipeline_create: ActionPipelineCreatePlain = {}
    if server_ids:
        action_pipeline_create["servers"] = server_ids

    response = await devopness.actions.add_pipeline_action(
        pipeline_id,
        action_pipeline_create,
    )

    await ctx.info(
        f"SSH key deployment has been triggered using pipeline ID {pipeline_id} "
        f"with SSH key ID {ssh_key_id}."
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
            "Explain the user how to use ssh to connect to the servers.",
        ],
    )


async def devopness_list_services(
    environment_id: int | None = None,
) -> MCPResponse[List[ServiceRelation]]:
    """
    List all services in the given environment.

    You Should:
        - Use this function to list all services within a specific environment.
        - Prompt the user to provide an environment ID if none is given.
        - If the user is unaware of the environment ID, utilize the
          `devopness_list_environments` tool to assist them in selecting the environment
        - Do NOT assume an environment ID without CONFIRMING with the user
          that the ID is appropriate for use.
        - If an invalid environment ID is given by the user, inform them
          and request a valid environment ID. DO NOT INVOKE THIS TOOL
          WITHOUT USER CONFIRMATION THAT THE ID IS VALID.
    """
    await ensure_authenticated()

    if environment_id is None:
        return MCPResponse.error(
            [
                "An environment ID is required to list services. "
                "Please ask the user to provide an environment ID."
            ]
        )

    if not isinstance(environment_id, int) or environment_id <= 0:
        return MCPResponse.error(
            [
                "The provided environment ID is invalid. "
                "Please ask the user to provide a valid environment ID."
            ]
        )

    response = await devopness.services.list_environment_services(environment_id)

    return MCPResponse.ok(
        response.data,
        [
            "Use the template below to format the list:",
            "{service.type_human_readable} (ID: {service.id})",
            "   - Version: {service.version}",
            "   - Last Action: {service.last_action.type_human_readable} ({service.last_action.status_human_readable})",  # noqa: E501
        ],
    )
