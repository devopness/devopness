from typing import Annotated, List, Literal, Optional

from pydantic import Field

from devopness.base.base_model import DevopnessBaseModel

type ResourceType = Literal[
    "application",
    "credential",
    "environment",
    "project",
    "server",
    "service",
    "ssh-key",
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
