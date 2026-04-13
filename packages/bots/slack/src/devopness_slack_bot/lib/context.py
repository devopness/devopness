"""Application context for Slack bot commands."""

from dataclasses import dataclass

from devopness_slack_bot.lib.environment import EnvironmentVariables


@dataclass
class AppContext:
    """
    Context object injected into all command handlers.

    This provides access to shared application state and configuration
    that commands need but isn't provided by Slack Bolt.

    Similar to ServerContext in the MCP server.
    """

    environment: EnvironmentVariables
    """Environment variables and configuration."""

    # Future extensions could include:
    # app: App  # Reference to the Slack app instance
    # logger: Logger  # Shared logger
    # cache: Cache  # Shared cache for API responses
    # metrics: Metrics  # Metrics collector
