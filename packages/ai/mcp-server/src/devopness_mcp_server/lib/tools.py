from typing import Any, Type

from mcp.server.fastmcp import FastMCP

from .services.application_service import ApplicationService
from .services.credential_service import CredentialService
from .services.environment_service import EnvironmentService
from .services.project_service import ProjectService
from .services.server_service import ServerService
from .services.service_service import ServiceService
from .services.ssh_key_service import SSHKeyService
from .services.user_service import UserService
from .services.webhook_service import WebHookService

MCP_TOOL_PREFIX = "tool_"
MCP_TOOL_PREFIX_LEN = len(MCP_TOOL_PREFIX)


def is_mcp_tool(name: str, member: Any) -> bool:  # noqa: ANN401
    return name.startswith(MCP_TOOL_PREFIX) and isinstance(member, staticmethod)


def register_tools_of_service(mcp_server: FastMCP, service: Type) -> None:
    tools: list[tuple[str, Any]] = []

    for name, member in service.__dict__.items():
        if not is_mcp_tool(name, member):
            continue

        tool_name: str = "devopness_" + name[MCP_TOOL_PREFIX_LEN:]
        tools.append((tool_name, member))

    # Sort tools by name
    tools.sort(key=lambda x: x[0])

    for name, func in tools:
        mcp_server.add_tool(
            name=name,
            fn=func,
        )


def register_tools(mcp_server: FastMCP) -> None:
    register_tools_of_service(mcp_server, ApplicationService)
    register_tools_of_service(mcp_server, CredentialService)
    register_tools_of_service(mcp_server, EnvironmentService)
    register_tools_of_service(mcp_server, ProjectService)
    register_tools_of_service(mcp_server, ServerService)
    register_tools_of_service(mcp_server, ServiceService)
    register_tools_of_service(mcp_server, SSHKeyService)
    register_tools_of_service(mcp_server, UserService)
    register_tools_of_service(mcp_server, WebHookService)
