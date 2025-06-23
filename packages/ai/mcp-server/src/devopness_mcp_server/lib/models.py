from typing import Literal, Optional

from devopness.base import DevopnessBaseModel

type ResourceType = Literal[
    "application",
    "credential",
    "environment",
    "project",
    "server",
    "service",
    "ssh-key",
]


class ProjectSummary(DevopnessBaseModel):
    id: int
    name: str


class EnvironmentSummary(DevopnessBaseModel):
    id: int
    name: str
    description: Optional[str]


class PipelineSummary(DevopnessBaseModel):
    id: int
    name: str
    operation: str


class SSHKeySummary(DevopnessBaseModel):
    id: int
    name: str
    fingerprint: str
