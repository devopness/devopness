"""
This module is responsible for discovering and registering Devopness tools
from service classes into the MCP Server.

Each tool is defined as a static method starting with the prefix 'tool_'
and is extracted automatically. These tools are renamed with a final prefix
'devopness_' and added to the FastMCP server, making them available for use
by the LLM.

Call `register_tools(mcp_server)` to make all tools available.
"""

from typing import Any, TypedDict

from mcp.server.fastmcp import FastMCP

from .services.application_service import ApplicationService
from .services.credential_service import CredentialService
from .services.daemon_service import DaemonService
from .services.environment_service import EnvironmentService
from .services.pipeline_service import PipelineService
from .services.project_service import ProjectService
from .services.server_service import ServerService
from .services.service_service import ServiceService
from .services.ssh_key_service import SSHKeyService
from .services.user_service import UserService
from .services.virtual_host_service import VirtualHostService
from .services.webhook_service import WebHookService


class Tool(TypedDict):
    name: str
    func: Any


MCP_TOOL_PREFIX = "tool_"
MCP_TOOL_PREFIX_LEN = len(MCP_TOOL_PREFIX)
MCP_TOOL_FINAL_PREFIX = "devopness_"


def is_mcp_tool(name: str, member: Any) -> bool:  # noqa: ANN401
    return name.startswith(MCP_TOOL_PREFIX) and isinstance(member, staticmethod)


def extract_tools_from_service(service: type) -> list[Tool]:
    tools: list[Tool] = []

    for name, member in service.__dict__.items():
        if not is_mcp_tool(name, member):
            continue

        tool_name: str = MCP_TOOL_FINAL_PREFIX + name[MCP_TOOL_PREFIX_LEN:]
        tool_func: Any = member.__func__

        tool = Tool(
            name=tool_name,
            func=tool_func,
        )

        tools.append(tool)

    return tools


def register_tools(mcp_server: FastMCP) -> None:
    services = [
        ApplicationService,
        CredentialService,
        DaemonService,
        EnvironmentService,
        PipelineService,
        ProjectService,
        ServerService,
        ServiceService,
        SSHKeyService,
        UserService,
        VirtualHostService,
        WebHookService,
    ]

    all_tools: list[Tool] = []

    for service in services:
        service_tools = extract_tools_from_service(service)
        all_tools.extend(service_tools)

    all_tools.sort(key=lambda tool: tool["name"])

    for tool in all_tools:
        mcp_server.add_tool(
            name=tool["name"],
            fn=tool["func"],
        )
