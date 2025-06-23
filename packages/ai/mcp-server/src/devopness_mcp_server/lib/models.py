from typing import List, Optional, cast

from devopness.base import DevopnessBaseModel
from devopness.models import (
    Action,
    ActionRelation,
    ActionRelationShallow,
    ActionStatus,
    ActionStatusReasonCode,
    ActionStep,
    ActionTarget,
    ActionType,
    Application,
    ApplicationRelation,
    CredentialRelation,
    EnvironmentRelation,
    PipelineRelation,
    ProjectRelation,
    Service,
    ServiceRelation,
    SshKey,
    SshKeyRelation,
)


class ProjectSummary(DevopnessBaseModel):
    id: int
    name: str

    @classmethod
    def from_sdk_model(
        cls,
        data: ProjectRelation,
    ) -> "ProjectSummary":
        return cls(
            id=data.id,
            name=data.name,
        )


class EnvironmentSummary(DevopnessBaseModel):
    id: int
    name: str
    description: Optional[str]

    @classmethod
    def from_sdk_model(
        cls,
        data: EnvironmentRelation,
    ) -> "EnvironmentSummary":
        return cls(
            id=data.id,
            name=data.name,
            description=data.description,
        )


class ActionTargetSummary(DevopnessBaseModel):
    id: int | None
    target_id: int | None
    target_type: str | None
    status: ActionStatus | None
    status_reason_code: ActionStatusReasonCode | None
    steps: List[ActionStep | None] | None

    @classmethod
    def from_sdk_model(cls, data: ActionTarget) -> "ActionTargetSummary":
        return cls(
            id=data.id,
            target_id=data.resource_id,
            target_type=data.resource_type,
            status=data.status,
            status_reason_code=data.status_reason_code,
            steps=data.steps,
        )


class ActionSummary(DevopnessBaseModel):
    id: int
    type: ActionType
    status: ActionStatus
    status_reason_code: ActionStatusReasonCode
    url_web_permalink: str
    targets: List[ActionTargetSummary]

    @classmethod
    def from_sdk_model(
        cls, data: Action | ActionRelation | ActionRelationShallow
    ) -> "ActionSummary":
        return cls(
            id=data.id,
            type=data.type,
            status=data.status,
            status_reason_code=data.status_reason_code,
            url_web_permalink=data.url_web_permalink,
            targets=[
                ActionTargetSummary.from_sdk_model(target)
                for target in data.targets or []
            ],
        )


class PipelineSummary(DevopnessBaseModel):
    id: int
    name: str
    operation: str

    @classmethod
    def from_sdk_model(cls, data: PipelineRelation) -> "PipelineSummary":
        return cls(
            id=data.id,
            name=data.name,
            operation=data.operation,
        )


class SSHKeySummary(DevopnessBaseModel):
    id: int
    name: str
    fingerprint: str
    last_action: Optional[ActionSummary] = None

    @classmethod
    def from_sdk_model(cls, data: SshKey | SshKeyRelation) -> "SSHKeySummary":
        return cls(
            id=data.id,
            name=data.name,
            fingerprint=data.fingerprint,
            last_action=(
                ActionSummary.from_sdk_model(data.last_action)
                if data.last_action is not None
                else None
            ),
        )


class CredentialSummary(DevopnessBaseModel):
    id: int
    name: str
    provider: str
    provider_type: str

    @classmethod
    def from_sdk_model(cls, data: CredentialRelation) -> "CredentialSummary":
        return cls(
            id=data.id,
            name=data.name,
            provider=data.provider.code_human_readable,
            provider_type=data.provider_type_human_readable,
        )


class ServiceSummary(DevopnessBaseModel):
    id: int
    name: str
    type: str
    version: str
    last_action: Optional[ActionSummary] = None

    @classmethod
    def from_sdk_model(cls, data: Service | ServiceRelation) -> "ServiceSummary":
        return cls(
            id=data.id,
            name=data.name,
            type=data.type,
            version=cast(str, data.version),
            last_action=(
                ActionSummary.from_sdk_model(data.last_action)
                if data.last_action is not None
                else None
            ),
        )


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

    @classmethod
    def from_sdk_model(
        cls, data: Application | ApplicationRelation
    ) -> "ApplicationSummary":
        return cls(
            id=data.id,
            name=data.name,
            repository=data.repository,
            programming_language=data.programming_language,
            programming_language_version=data.engine_version,
            programming_language_framework=data.framework,
            root_directory=data.root_directory,
            install_dependencies_command=data.install_dependencies_command,
            build_command=data.build_command,
            last_action=(
                ActionSummary.from_sdk_model(data.last_deployments.latest)
                if data.last_deployments is not None
                and data.last_deployments.latest is not None
                else None
            ),
        )
