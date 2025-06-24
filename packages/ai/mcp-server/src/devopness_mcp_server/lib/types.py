"""
This module defines types and constants used to manage data visibility
when interacting with Large Language Models (LLMs) in the MCP Server.
"""

from typing import Annotated, List, Literal, Optional

from pydantic import Field

from devopness.base.base_model import DevopnessBaseModel

MAX_RESOURCES_PER_PAGE = 5
"""
The Large Language Models (LLMs) can start hallucinating during resource listing
if the volume of data is 'large', which is easily achieved when listing an
environment resource such as an application or server.

To avoid the hallucinations that can lead to errors and harm to the user of the
MCP Server, we set the maximum number of resources per page for listing.

If the resource that the user is looking for is not on the first page,
the LLM is able to list the <page + 1> until it finds the user's resource.
"""

type ResourceType = Literal[
    "application",
    "credential",
    "daemon",
    "environment",
    "project",
    "server",
    "service",
    "ssh-key",
    "virtual-host",
]

type TypeListServerID = Annotated[
    List[int],
    Field(
        min_length=1,
        description="List of Server IDs to which the action will be targeted.",
    ),
]


class ExtraData(DevopnessBaseModel):
    url_web_permalink: Optional[str] = None


type TypeExtraData = Optional[ExtraData]
