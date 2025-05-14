"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from typing import Optional, Union

from .base import DevopnessBaseService, DevopnessBaseServiceAsync
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
from .services.hook_service import (
    HookService,
    HookServiceAsync,
)
from .services.network_rule_service import (
    NetworkRuleService,
    NetworkRuleServiceAsync,
)
from .services.network_service import (
    NetworkService,
    NetworkServiceAsync,
)
from .services.organization_service import (
    OrganizationService,
    OrganizationServiceAsync,
)
from .services.pipeline_service import (
    PipelineService,
    PipelineServiceAsync,
)
from .services.project_service import (
    ProjectService,
    ProjectServiceAsync,
)
from .services.resource_event_service import (
    ResourceEventService,
    ResourceEventServiceAsync,
)
from .services.resource_link_service import (
    ResourceLinkService,
    ResourceLinkServiceAsync,
)
from .services.role_service import (
    RoleService,
    RoleServiceAsync,
)
from .services.server_service import (
    ServerService,
    ServerServiceAsync,
)
from .services.service_service import (
    ServiceService,
    ServiceServiceAsync,
)
from .services.social_account_service import (
    SocialAccountService,
    SocialAccountServiceAsync,
)
from .services.ssh_key_service import (
    SSHKeyService,
    SSHKeyServiceAsync,
)
from .services.ssl_certificate_service import (
    SSLCertificateService,
    SSLCertificateServiceAsync,
)
from .services.static_service import (
    StaticService,
    StaticServiceAsync,
)
from .services.subnet_service import (
    SubnetService,
    SubnetServiceAsync,
)
from .services.team_service import (
    TeamService,
    TeamServiceAsync,
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
    hooks: HookService
    network_rules: NetworkRuleService
    networks: NetworkService
    organizations: OrganizationService
    pipelines: PipelineService
    projects: ProjectService
    resource_events: ResourceEventService
    resource_links: ResourceLinkService
    roles: RoleService
    servers: ServerService
    services: ServiceService
    social_accounts: SocialAccountService
    ssh_keys: SSHKeyService
    ssl_certificates: SSLCertificateService
    static: StaticService
    subnets: SubnetService
    teams: TeamService
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
        self.hooks = HookService()
        self.network_rules = NetworkRuleService()
        self.networks = NetworkService()
        self.organizations = OrganizationService()
        self.pipelines = PipelineService()
        self.projects = ProjectService()
        self.resource_events = ResourceEventService()
        self.resource_links = ResourceLinkService()
        self.roles = RoleService()
        self.servers = ServerService()
        self.services = ServiceService()
        self.social_accounts = SocialAccountService()
        self.ssh_keys = SSHKeyService()
        self.ssl_certificates = SSLCertificateService()
        self.static = StaticService()
        self.subnets = SubnetService()
        self.teams = TeamService()
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
    hooks: HookServiceAsync
    network_rules: NetworkRuleServiceAsync
    networks: NetworkServiceAsync
    organizations: OrganizationServiceAsync
    pipelines: PipelineServiceAsync
    projects: ProjectServiceAsync
    resource_events: ResourceEventServiceAsync
    resource_links: ResourceLinkServiceAsync
    roles: RoleServiceAsync
    servers: ServerServiceAsync
    services: ServiceServiceAsync
    social_accounts: SocialAccountServiceAsync
    ssh_keys: SSHKeyServiceAsync
    ssl_certificates: SSLCertificateServiceAsync
    static: StaticServiceAsync
    subnets: SubnetServiceAsync
    teams: TeamServiceAsync
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

        DevopnessBaseServiceAsync._config = config

        self.actions = ActionServiceAsync()
        self.applications = ApplicationServiceAsync()
        self.credentials = CredentialServiceAsync()
        self.cron_jobs = CronJobServiceAsync()
        self.daemons = DaemonServiceAsync()
        self.environments = EnvironmentServiceAsync()
        self.hooks = HookServiceAsync()
        self.network_rules = NetworkRuleServiceAsync()
        self.networks = NetworkServiceAsync()
        self.organizations = OrganizationServiceAsync()
        self.pipelines = PipelineServiceAsync()
        self.projects = ProjectServiceAsync()
        self.resource_events = ResourceEventServiceAsync()
        self.resource_links = ResourceLinkServiceAsync()
        self.roles = RoleServiceAsync()
        self.servers = ServerServiceAsync()
        self.services = ServiceServiceAsync()
        self.social_accounts = SocialAccountServiceAsync()
        self.ssh_keys = SSHKeyServiceAsync()
        self.ssl_certificates = SSLCertificateServiceAsync()
        self.static = StaticServiceAsync()
        self.subnets = SubnetServiceAsync()
        self.teams = TeamServiceAsync()
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
