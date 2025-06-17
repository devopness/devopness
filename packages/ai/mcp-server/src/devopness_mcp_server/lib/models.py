from typing import Optional

from devopness.base import DevopnessBaseModel


class ProjectSummary(DevopnessBaseModel):
    id: int
    name: str


class EnvironmentSummary(DevopnessBaseModel):
    id: int
    name: str
    description: Optional[str]
