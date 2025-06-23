from typing import Annotated, List, Literal, Optional

from pydantic import Field

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

type ServerIDs = Annotated[
    List[int],
    Field(
        min_length=1,
        description="List of Server IDs to which the action will be targeted.",
    ),
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


class CredentialSummary(DevopnessBaseModel):
    id: int
    name: str
    provider: str
    provider_type: str


class ServiceSummary(DevopnessBaseModel):
    id: int
    name: str
    type: str
    version: str


class ApplicationSummary(DevopnessBaseModel):
    id: int
    name: str
    repository: str
    programming_language: str
    programming_language_version: str
    programming_language_framework: str
    root_directory: Optional[str] = None
    install_dependencies_command: Optional[str] = None
    build_command: Optional[str] = None
