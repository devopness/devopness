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
    Server,
    ServerRelation,
    ServerStatus,
    Service,
    ServiceRelation,
    SshKey,
    SshKeyRelation,
)

from .types import TypeExtraData


class ProjectSummary(DevopnessBaseModel):
    id: int
    name: str
    url_web_permalink: str

    @classmethod
    def from_sdk_model(
        cls,
        data: ProjectRelation,
    ) -> "ProjectSummary":
        return cls(
            id=data.id,
            name=data.name,
            url_web_permalink=f"https://app.devopness.com/projects/{data.id}",
        )


class EnvironmentSummary(DevopnessBaseModel):
    id: int
    name: str
    description: Optional[str]
    url_web_permalink: Optional[str] = None

    @classmethod
    def from_sdk_model(
        cls,
        data: EnvironmentRelation,
        extra_data: TypeExtraData = None,
    ) -> "EnvironmentSummary":
        return cls(
            id=data.id,
            name=data.name,
            description=data.description,
            url_web_permalink=extra_data.url_web_permalink if extra_data else None,
        )


class ActionSummary(DevopnessBaseModel):
    id: int
    type: str
    status: str
    status_reason_code: str
    url_web_permalink: str

    @classmethod
    def from_sdk_model(
        cls,
        data: Action | ActionRelation | ActionRelationShallow,
    ) -> "ActionSummary":
        return cls(
            id=data.id,
            type=data.type_human_readable,
            status=data.status_human_readable,
            status_reason_code=data.status_reason_human_readable,
            url_web_permalink=data.url_web_permalink,
        )


class PipelineSummary(DevopnessBaseModel):
    id: int
    name: str
    operation: str

    @classmethod
    def from_sdk_model(
        cls,
        data: PipelineRelation,
    ) -> "PipelineSummary":
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
    url_web_permalink: Optional[str] = None

    @classmethod
    def from_sdk_model(
        cls,
        data: SshKey | SshKeyRelation,
        extra_data: TypeExtraData = None,
    ) -> "SSHKeySummary":
        return cls(
            id=data.id,
            name=data.name,
            fingerprint=data.fingerprint,
            last_action=(
                ActionSummary.from_sdk_model(data.last_action)
                if data.last_action is not None
                else None
            ),
            url_web_permalink=extra_data.url_web_permalink if extra_data else None,
        )


class CredentialSummary(DevopnessBaseModel):
    id: int
    name: str
    provider: str
    provider_type: str
    url_web_permalink: Optional[str] = None

    @classmethod
    def from_sdk_model(
        cls,
        data: CredentialRelation,
        extra_data: TypeExtraData = None,
    ) -> "CredentialSummary":
        return cls(
            id=data.id,
            name=data.name,
            provider=data.provider.code_human_readable,
            provider_type=data.provider_type_human_readable,
            url_web_permalink=extra_data.url_web_permalink if extra_data else None,
        )


class ServiceSummary(DevopnessBaseModel):
    id: int
    name: str
    type: str
    version: str
    last_action: Optional[ActionSummary] = None
    url_web_permalink: Optional[str] = None

    @classmethod
    def from_sdk_model(
        cls,
        data: Service | ServiceRelation,
        extra_data: TypeExtraData = None,
    ) -> "ServiceSummary":
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
            url_web_permalink=extra_data.url_web_permalink if extra_data else None,
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
    url_web_permalink: Optional[str] = None

    @classmethod
    def from_sdk_model(
        cls,
        data: Application | ApplicationRelation,
        extra_data: TypeExtraData = None,
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
            url_web_permalink=extra_data.url_web_permalink if extra_data else None,
        )


class ServerSummary(DevopnessBaseModel):
    id: int
    name: str
    status: ServerStatus
    ip_address: Optional[str] = None
    ssh_port: int
    provider_code: str
    provider_region: Optional[str] = None
    last_action: Optional[ActionSummary] = None
    url_web_permalink: Optional[str] = None

    @classmethod
    def from_sdk_model(
        cls,
        data: Server | ServerRelation,
        extra_data: TypeExtraData = None,
    ) -> "ServerSummary":
        return cls(
            id=data.id,
            name=data.name,
            status=data.status,
            ip_address=data.ip_address,
            ssh_port=data.ssh_port,
            provider_code=data.provider_name,
            provider_region=(
                data.region
                if isinstance(data, ServerRelation)
                else getattr(
                    data.provision_input.settings,
                    "region",
                    None,
                )
            ),
            last_action=(
                ActionSummary.from_sdk_model(data.last_action)
                if data.last_action is not None
                else None
            ),
            url_web_permalink=extra_data.url_web_permalink if extra_data else None,
        )
