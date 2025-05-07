"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Optional, Union

from .base import DevopnessBaseService
from .client_config import DevopnessClientConfig, DevopnessClientConfigDict
from .services.action_service import ActionService
from .services.application_service import ApplicationService
from .services.credential_service import CredentialService
from .services.cron_job_service import CronJobService
from .services.daemon_service import DaemonService
from .services.environment_service import EnvironmentService
from .services.network_service import NetworkService
from .services.pipeline_service import PipelineService
from .services.project_service import ProjectService
from .services.resource_link_service import ResourceLinkService
from .services.server_service import ServerService
from .services.service_service import ServiceService
from .services.ssh_key_service import SSHKeyService
from .services.subnet_service import SubnetService
from .services.user_service import UserService
from .services.variable_service import VariableService
from .services.virtual_host_service import VirtualHostService

__all__ = ["DevopnessClient"]


class DevopnessClient:
    """
    DevopnessApiClient provides an interface to the Devopness API.
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
