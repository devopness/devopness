from typing import Annotated, List, Literal, Optional

from pydantic import Field

from devopness.base import DevopnessBaseModel
from devopness.models import (
    ActionStatus,
    ActionStatusReasonCode,
    ActionType,
)
from devopness.models import (
    ActionSummary as DevopnessActionSummary,
)

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


class ActionSummary(DevopnessBaseModel):
    id: int
    type: ActionType
    status: ActionStatus
    status_reason_code: ActionStatusReasonCode
    url_web_permalink: str
    summary: Optional[DevopnessActionSummary] = None


class PipelineSummary(DevopnessBaseModel):
    id: int
    name: str
    operation: str


class SSHKeySummary(DevopnessBaseModel):
    id: int
    name: str
    fingerprint: str
    last_action: Optional[ActionSummary] = None


class CredentialSummary(DevopnessBaseModel):
    id: int
    name: str
    provider: str
    provider_type: str
    last_action: Optional[ActionSummary] = None


class ServiceSummary(DevopnessBaseModel):
    id: int
    name: str
    type: str
    version: str
    last_action: Optional[ActionSummary] = None


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
    last_action: Optional[ActionSummary] = None
