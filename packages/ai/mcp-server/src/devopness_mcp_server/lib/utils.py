from .models import ResourceType


def get_web_link_to_environment_resource(
    project_id: int,
    environment_id: int,
    resource_type: ResourceType,
    resource_id: int,
) -> str:
    return (
        "https://app.devopness.com/"
        f"projects/{project_id}/"
        f"environments/{environment_id}/"
        f"{resource_type}s/{resource_id}/"
    )


def get_format_list_instructions(
    header: str,
    extra_instructions: list[str] | None = None,
) -> list[str]:
    return [
        "You MUST present the list using the exact format shown below:",
        header,
        *(extra_instructions or []),
        "Make sure each item follows this structure and "
        "that the formatting is consistent.",
    ]


def get_next_action_suggestion_instructions(
    action: str,
    resource_type: ResourceType,
) -> str:
    return (
        f"You MUST clearly instruct the user to {action} the {resource_type} next.\n"
        f"Use imperative language and avoid ambiguity."
    )


def get_how_to_monitor_action_instructions(
    action_url_web_permalink: str,
) -> str:
    return (
        "You MUST explain to the user how to monitor the progress of the operation.\n"
        "You MUST instruct the user to visit the following link to view the"
        f" real-time progress: {action_url_web_permalink}\n"
        "Make it clear that the page contains status tracking and logs."
    )


def get_choose_resource_instructions(
    resource_type: ResourceType,
) -> str:
    return f"""
        Rules:
        1. If the user has multiple {resource_type}s ask them to choose one
           of the listed {resource_type} IDs to continue with the conversation.
        2. If the user has only one {resource_type}, you can use it directly,
           and communicate with the user about it.
    """
