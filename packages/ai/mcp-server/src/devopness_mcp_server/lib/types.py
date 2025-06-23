from typing import Annotated, List, Literal

from pydantic import Field

type ResourceType = Literal[
    "application",
    "credential",
    "environment",
    "project",
    "server",
    "service",
    "ssh-key",
]

type ServerIDs = Annotated[
    List[int],
    Field(
        min_length=1,
        description="List of Server IDs to which the action will be targeted.",
    ),
]
