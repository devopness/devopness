from server import server


def run() -> None:
    """
    Start the Devopness MCP Server.

    This is the main entry-point for the MCP server.

    It sets up the server, registers the tools and then starts the server.
    """
    server.run()


if __name__ == "__main__":
    run()
