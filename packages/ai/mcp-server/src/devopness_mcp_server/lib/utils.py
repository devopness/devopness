"""
Utility functions for generating formatted strings and instructions related to
MCP Server.

These helpers produce consistent textual patterns, URLs, and instructions
for various resource types such as applications, servers, environments, etc.,
to be used primarily in communication with LLMs.

All functions ensure consistent, clear, and user-friendly communication patterns
when interacting with resources in the Devopness MCP server ecosystem.
"""

from .types import ResourceType


def get_last_action_repl(
    resource_type: ResourceType,
) -> str:
    """
    Returns a formatted markdown string representing the last action performed
    on a resource.
    """
    return (
        "**Last Action:** "
        "[{" + resource_type + "}.last_action.type}]"
        "({" + resource_type + ".last_action.url_web_permalink}) "
        "**({" + resource_type + ".last_action.status})**"
    )


def get_web_link_to_environment_resource(
    project_id: int,
    environment_id: int,
    resource_type: ResourceType,
    resource_id: int,
) -> str:
    """
    Constructs a URL linking to a specific resource within a project environment.
    """
    return (
        "https://app.devopness.com/"
        + f"projects/{project_id}/"
        + f"environments/{environment_id}/"
        + f"{resource_type}s/{resource_id}/"
    )


def get_instructions_format_resource(
    resource_type: ResourceType,
    pattern: list[str],
) -> str:
    return (
        f"You MUST present the {resource_type} using the exact format shown below:\n"
        f"{' '.join(pattern)}\n"
        "Make sure the formatting is consistent and follows the structure."
    )


def get_instructions_format_list(
    header: str,
    extra_instructions: list[str] | None = None,
) -> list[str]:
    return [
        "You MUST present a bullet list in the below format:",
        header,
        *(extra_instructions or []),
        "Make sure each item follows this structure and "
        "that the formatting is consistent. Do not modify "
        "the order of the list items. Do not add or remove "
        "any items. Include all the required items in the list.",
    ]


def get_instructions_next_action_suggestion(
    action: str,
    resource_type: ResourceType,
) -> str:
    return (
        f"You MUST clearly instruct the user to {action} the {resource_type} next.\n"
        f"Use imperative language and avoid ambiguity."
    )


def get_instructions_how_to_monitor_action(
    action_url_web_permalink: str,
) -> str:
    return (
        "You MUST instruct the user to visit the following link to view the"
        f" real-time progress: {action_url_web_permalink}\n"
        "Make it clear that the page contains status tracking and logs."
    )


def get_instructions_choose_resource(
    resource_type: ResourceType,
) -> list[str]:
    return [
        f"IF the list contains multiple {resource_type}s. "
        "You MUST show the following message to the user:",
        f"Please enter the ID or name of the {resource_type} you want to work with, "
        f"or type `next page` if your {resource_type} isn't listed here.",
        #
        f"IF the list contains only one {resource_type}. "
        "You MUST show the following message to the user:",
        "Found one " + resource_type + " with ID {resource_id}. "
        "I will use it to achieve our goal.",
    ]
