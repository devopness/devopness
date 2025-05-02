"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Optional, Union

from .base import DevopnessBaseService
from .client_config import DevopnessClientConfig, DevopnessClientConfigDict
from .services.application_service import ApplicationService
from .services.credential_service import CredentialService
from .services.cron_job_service import CronJobService
from .services.daemon_service import DaemonService
from .services.environment_service import EnvironmentService
from .services.network_service import NetworkService
from .services.project_service import ProjectService
from .services.server_service import ServerService
from .services.service_service import ServiceService
from .services.subnet_service import SubnetService
from .services.user_service import UserService
from .services.virtual_host_service import VirtualHostService

__all__ = ["DevopnessClient"]


class DevopnessClient:
    """
    DevopnessApiClient provides an interface to the Devopness API.
    """

    applications: ApplicationService
    credentials: CredentialService
    cron_jobs: CronJobService
    daemons: DaemonService
    environments: EnvironmentService
    networks: NetworkService
    projects: ProjectService
    servers: ServerService
    services: ServiceService
    subnets: SubnetService
    users: UserService
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

        self.applications = ApplicationService(config)
        self.credentials = CredentialService(config)
        self.cron_jobs = CronJobService(config)
        self.daemons = DaemonService(config)
        self.environments = EnvironmentService(config)
        self.networks = NetworkService(config)
        self.projects = ProjectService(config)
        self.servers = ServerService(config)
        self.services = ServiceService(config)
        self.subnets = SubnetService(config)
        self.users = UserService(config)
        self.virtual_hosts = VirtualHostService(config)

    def __set_access_token(self, access_token: str) -> None:
        # pylint: disable=protected-access
        DevopnessBaseService._access_token = access_token

    def __get_access_token(self) -> str:
        # pylint: disable=protected-access
        return DevopnessBaseService._access_token  # type: ignore

    access_token = property(fset=__set_access_token, fget=__get_access_token)
