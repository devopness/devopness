from mcp.server.fastmcp import FastMCP

from .lib.tools import register_tools

server = FastMCP("Devopness")

register_tools(server)
