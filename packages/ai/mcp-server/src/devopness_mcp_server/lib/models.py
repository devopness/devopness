from typing import Optional

from devopness.base import DevopnessBaseModel


class Project(DevopnessBaseModel):
    id: int
    name: str


class Environment(DevopnessBaseModel):
    id: int
    name: str
    description: Optional[str]
