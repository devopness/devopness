from lib.tools import register_tools
from mcp.server.fastmcp import FastMCP

server = FastMCP("Devopness")

register_tools(server)
