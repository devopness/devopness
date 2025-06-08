from typing import List

from mcp.server.fastmcp import FastMCP

from devopness.models import (
    Application,
    ApplicationEnvironmentCreate,
    ApplicationRelation,
    CredentialRelation,
    DeploymentApplicationCreate,
    DeploymentApplicationCreatePlain,
    EnvironmentRelation,
    Hook,
    HookPipelineCreate,
    HookTypeParam,
    PipelineRelation,
    ProjectRelation,
    Server,
    ServerEnvironmentCreate,
    ServerRelation,
    UserMe,
)
from lib.devopness_api import devopness, ensure_authenticated


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
    application_id: int,
    deployment_application_create: DeploymentApplicationCreatePlain,
) -> None:
    await ensure_authenticated()
    response = await devopness.applications.add_application_deployment(
        application_id,
        deployment_application_create,
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
