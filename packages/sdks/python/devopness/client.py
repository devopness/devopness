"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Optional, Union

from .base import DevopnessBaseService
from .client_config import DevopnessClientConfig, DevopnessClientConfigDict
from .services.action_service import (
    ActionService,
    ActionServiceAsync,
)
from .services.application_service import (
    ApplicationService,
    ApplicationServiceAsync,
)
from .services.credential_service import (
    CredentialService,
    CredentialServiceAsync,
)
from .services.cron_job_service import (
    CronJobService,
    CronJobServiceAsync,
)
from .services.daemon_service import (
    DaemonService,
    DaemonServiceAsync,
)
from .services.environment_service import (
    EnvironmentService,
    EnvironmentServiceAsync,
)
from .services.network_service import (
    NetworkService,
    NetworkServiceAsync,
)
from .services.pipeline_service import (
    PipelineService,
    PipelineServiceAsync,
)
from .services.project_service import (
    ProjectService,
    ProjectServiceAsync,
)
from .services.resource_link_service import (
    ResourceLinkService,
    ResourceLinkServiceAsync,
)
from .services.server_service import (
    ServerService,
    ServerServiceAsync,
)
from .services.service_service import (
    ServiceService,
    ServiceServiceAsync,
)
from .services.ssh_key_service import (
    SSHKeyService,
    SSHKeyServiceAsync,
)
from .services.subnet_service import (
    SubnetService,
    SubnetServiceAsync,
)
from .services.user_service import (
    UserService,
    UserServiceAsync,
)
from .services.variable_service import (
    VariableService,
    VariableServiceAsync,
)
from .services.virtual_host_service import (
    VirtualHostService,
    VirtualHostServiceAsync,
)

__all__ = ["DevopnessClient", "DevopnessClientAsync"]


class DevopnessClient:
    """
    Client that provides an interface to the Devopness API.
    """

    actions: ActionService
    applications: ApplicationService
    credentials: CredentialService
    cron_jobs: CronJobService
    daemons: DaemonService
    environments: EnvironmentService
    networks: NetworkService
    pipelines: PipelineService
    projects: ProjectService
    resource_links: ResourceLinkService
    servers: ServerService
    services: ServiceService
    ssh_keys: SSHKeyService
    subnets: SubnetService
    users: UserService
    variables: VariableService
    virtual_hosts: VirtualHostService

    def __init__(
        self,
        config: Optional[
            Union[DevopnessClientConfig, DevopnessClientConfigDict]
        ] = None,
    ) -> None:
        if config is None:
            config = DevopnessClientConfig()
        elif isinstance(config, dict):
            config = DevopnessClientConfig.from_dict(config)

        DevopnessBaseService._config = config

        self.actions = ActionService()
        self.applications = ApplicationService()
        self.credentials = CredentialService()
        self.cron_jobs = CronJobService()
        self.daemons = DaemonService()
        self.environments = EnvironmentService()
        self.networks = NetworkService()
        self.pipelines = PipelineService()
        self.projects = ProjectService()
        self.resource_links = ResourceLinkService()
        self.servers = ServerService()
        self.services = ServiceService()
        self.ssh_keys = SSHKeyService()
        self.subnets = SubnetService()
        self.users = UserService()
        self.variables = VariableService()
        self.virtual_hosts = VirtualHostService()

    def __set_access_token(self, access_token: str) -> None:
        # pylint: disable=protected-access
        DevopnessBaseService._access_token = access_token

    def __get_access_token(self) -> Optional[str]:
        # pylint: disable=protected-access
        return DevopnessBaseService._access_token

    access_token = property(fset=__set_access_token, fget=__get_access_token)


class DevopnessClientAsync:
    """
    Async client that provides an interface to the Devopness API.
    """

    actions: ActionServiceAsync
    applications: ApplicationServiceAsync
    credentials: CredentialServiceAsync
    cron_jobs: CronJobServiceAsync
    daemons: DaemonServiceAsync
    environments: EnvironmentServiceAsync
    networks: NetworkServiceAsync
    pipelines: PipelineServiceAsync
    projects: ProjectServiceAsync
    resource_links: ResourceLinkServiceAsync
    servers: ServerServiceAsync
    services: ServiceServiceAsync
    ssh_keys: SSHKeyServiceAsync
    subnets: SubnetServiceAsync
    users: UserServiceAsync
    variables: VariableServiceAsync
    virtual_hosts: VirtualHostServiceAsync

    def __init__(
        self,
        config: Optional[
            Union[DevopnessClientConfig, DevopnessClientConfigDict]
        ] = None,
    ) -> None:
        if config is None:
            config = DevopnessClientConfig()
        elif isinstance(config, dict):
            config = DevopnessClientConfig.from_dict(config)

        DevopnessBaseService._config = config

        self.actions = ActionServiceAsync()
        self.applications = ApplicationServiceAsync()
        self.credentials = CredentialServiceAsync()
        self.cron_jobs = CronJobServiceAsync()
        self.daemons = DaemonServiceAsync()
        self.environments = EnvironmentServiceAsync()
        self.networks = NetworkServiceAsync()
        self.pipelines = PipelineServiceAsync()
        self.projects = ProjectServiceAsync()
        self.resource_links = ResourceLinkServiceAsync()
        self.servers = ServerServiceAsync()
        self.services = ServiceServiceAsync()
        self.ssh_keys = SSHKeyServiceAsync()
        self.subnets = SubnetServiceAsync()
        self.users = UserServiceAsync()
        self.variables = VariableServiceAsync()
        self.virtual_hosts = VirtualHostServiceAsync()

    def __set_access_token(self, access_token: str) -> None:
        # pylint: disable=protected-access
        DevopnessBaseService._access_token = access_token

    def __get_access_token(self) -> Optional[str]:
        # pylint: disable=protected-access
        return DevopnessBaseService._access_token

    access_token = property(fset=__set_access_token, fget=__get_access_token)
