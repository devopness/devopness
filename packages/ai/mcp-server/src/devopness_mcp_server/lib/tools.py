from typing import Any, List

from mcp.server.fastmcp import Context, FastMCP

from devopness.models import (
    Action,
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
    SourceTypePlain,
    UserMe,
    SshKey,
)

from .devopness_api import devopness, ensure_authenticated
from .response import MCPResponse


def register_tools(mcp_server: FastMCP) -> None:
    """
    Register all Devopness tools that will be made available for the MCP server.
    """

    mcp_server.add_tool(devopness_get_user_profile)
    mcp_server.add_tool(devopness_list_projects)
    mcp_server.add_tool(devopness_list_environments)
    mcp_server.add_tool(devopness_list_credentials)
    mcp_server.add_tool(devopness_list_servers)
    mcp_server.add_tool(devopness_list_applications)
    mcp_server.add_tool(devopness_list_application_pipelines)

    mcp_server.add_tool(devopness_create_cloud_server)
    mcp_server.add_tool(devopness_create_application)
    mcp_server.add_tool(devopness_deploy_application)
    mcp_server.add_tool(devopness_create_webhook)


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
) -> Action | str:
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
            return (
                "A pipeline ID or an application ID is required to trigger"
                " a deployment. Please ask the user to provide one of them."
            )

        response_pipelines = await devopness_list_application_pipelines(application_id)

        deploy_pipelines = [
            pipeline
            for pipeline in response_pipelines
            if pipeline.operation == "deploy"
        ]

        if len(deploy_pipelines) == 0:
            return (
                "No deployment pipelines were found for the given application ID. "
                "Please ask the user to verify the application and try again."
            )

        msg: List[str] = [
            "The following deployment pipelines were found for this application:",
        ]

        for pipeline in deploy_pipelines:
            msg.append(f"- {pipeline.name} (ID: {pipeline.id})")

        msg.append(
            "Please ask the user to choose one of the listed pipeline IDs. "
            "Then call this function again with the selected ID as the 'pipeline_id'"
            " argument."
        )

        return "\n".join(msg)

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

    return response.data


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

    return MCPResponse[SshKey].ok(response.data)
