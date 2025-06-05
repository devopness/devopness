import devopness_api
from mcp.server.fastmcp import FastMCP

from devopness.models import (
    HookPipelineCreate,
    ServerEnvironmentCreate,
    HookTypeParam,
)

server = FastMCP("Devopness")


# At the moment, we are not using resources, only tools.
# Reason: some MCP clients (e.g. Cursor [1] [2]) do not support MCP resources.
# See:
# [1] https://forum.cursor.com/t/cursor-mcp-resource-feature-support/50987/5
# [2] https://forum.cursor.com/t/cursor-not-picking-up-resources/60834/6
# @server.resource("users://me")
# @server.resource("users://{user_id}")
@server.tool()
async def devopness_get_user_profile() -> str:
    """Get details for current user"""
    return await devopness_api.get_user_profile()


# @server.resource("projects://all")
@server.tool()
async def devopness_list_projects():
    """List all projects"""
    return await devopness_api.list_projects()


@server.tool()
async def devopness_list_environments(project_id: int):
    """List all environments for a given project"""
    return await devopness_api.list_environments(project_id)


@server.tool()
async def devopness_list_credentials(environment_id: int):
    """List all credentials for a given environment"""
    return await devopness_api.list_credentials(environment_id)


@server.tool()
async def devopness_list_servers(environment_id: int):
    """List servers in a given environment"""
    return await devopness_api.list_servers(environment_id)


@server.tool()
async def devopness_create_cloud_server(
    environment_id: int, server_input_settings: ServerEnvironmentCreate
):
    """List servers in a given environment"""

    # action = create_server.last_action;
    # wait until action.status in ['failed', 'completed']:
    #     # TODO: apply "logger" best practices to display progress of the flow
    # TODO: add validation and recommendation for server_input_settings
    #   Example: user should be able to tell the spec of the desired instance type, without the need to know the instace type
    #     e.g.: "I want the cheapest server with at least 4 GB of memory"
    return await devopness_api.create_server(environment_id, server_input_settings)


@server.tool()
async def devopness_list_applications(environment_id: int):
    """List servers in a given environment"""
    return await devopness_api.list_applications(environment_id)


@server.tool()
async def devopness_list_application_pipelines(application_id: int):
    """List pipelines for a given application"""
    return await devopness_api.list_application_pipelines(application_id)


@server.tool()
async def devopness_create_webhook(
    pipeline_id: int, hook_type: HookTypeParam, hook_settings: HookPipelineCreate
):
    """Creates a webhook for a given pipeline.
    Most common use case is to create an incoming webhook to deploy an application.
    """
    return await devopness_api.create_webhook(pipeline_id, hook_type, hook_settings)
