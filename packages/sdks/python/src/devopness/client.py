"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from .base import DevopnessClientState
from .client_config import (
    DevopnessClientConfig,
    DevopnessClientConfigDict,
)
from .services.action_service import (
    ActionService,
    ActionServiceAsync,
)
from .services.api_token_service import (
    APITokenService,
    APITokenServiceAsync,
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
    api_tokens: APITokenService
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
        config: DevopnessClientConfig | DevopnessClientConfigDict | None = None,
    ) -> None:
        """
        Build a synchronous Devopness client with isolated per-instance state.
        """
        self._state = self._build_state(config)

        self.actions = ActionService(self._state)
        self.api_tokens = APITokenService(self._state)
        self.applications = ApplicationService(self._state)
        self.credentials = CredentialService(self._state)
        self.cron_jobs = CronJobService(self._state)
        self.daemons = DaemonService(self._state)
        self.environments = EnvironmentService(self._state)
        self.hooks = HookService(self._state)
        self.network_rules = NetworkRuleService(self._state)
        self.networks = NetworkService(self._state)
        self.organizations = OrganizationService(self._state)
        self.pipelines = PipelineService(self._state)
        self.projects = ProjectService(self._state)
        self.resource_events = ResourceEventService(self._state)
        self.resource_links = ResourceLinkService(self._state)
        self.roles = RoleService(self._state)
        self.servers = ServerService(self._state)
        self.services = ServiceService(self._state)
        self.social_accounts = SocialAccountService(self._state)
        self.ssh_keys = SSHKeyService(self._state)
        self.ssl_certificates = SSLCertificateService(self._state)
        self.static = StaticService(self._state)
        self.subnets = SubnetService(self._state)
        self.teams = TeamService(self._state)
        self.users = UserService(self._state)
        self.variables = VariableService(self._state)
        self.virtual_hosts = VirtualHostService(self._state)

    @staticmethod
    def _build_state(
        config: DevopnessClientConfig | DevopnessClientConfigDict | None,
    ) -> DevopnessClientState:
        """
        Normalize user input into an isolated client state object.
        """
        if config is None:
            normalized_config = DevopnessClientConfig()
        elif isinstance(config, dict):
            normalized_config = DevopnessClientConfig.from_dict(config)
        else:
            normalized_config = config

        normalized_config = normalized_config.model_copy(deep=True)
        state = DevopnessClientState(config=normalized_config)
        return state

    def __set_api_token(self, api_token: str) -> None:
        """
        Update the API token for this client instance.
        """
        self._state.config.api_token = api_token

    def __get_api_token(self) -> str | None:
        """
        Return the API token for this client instance.
        """
        api_token = self._state.config.api_token
        return api_token

    def __set_access_token(self, access_token: str) -> None:
        """
        Update the access token for this client instance.
        """
        self._state.access_token = access_token

    def __get_access_token(self) -> str | None:
        """
        Return the access token for this client instance.
        """
        access_token = self._state.access_token
        return access_token

    api_token = property(fset=__set_api_token, fget=__get_api_token)
    access_token = property(fset=__set_access_token, fget=__get_access_token)


class DevopnessClientAsync:
    """
    Async client that provides an interface to the Devopness API.
    """

    actions: ActionServiceAsync
    api_tokens: APITokenServiceAsync
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
        config: DevopnessClientConfig | DevopnessClientConfigDict | None = None,
    ) -> None:
        """
        Build an asynchronous Devopness client with isolated per-instance state.
        """
        self._state = DevopnessClient._build_state(config)

        self.actions = ActionServiceAsync(self._state)
        self.api_tokens = APITokenServiceAsync(self._state)
        self.applications = ApplicationServiceAsync(self._state)
        self.credentials = CredentialServiceAsync(self._state)
        self.cron_jobs = CronJobServiceAsync(self._state)
        self.daemons = DaemonServiceAsync(self._state)
        self.environments = EnvironmentServiceAsync(self._state)
        self.hooks = HookServiceAsync(self._state)
        self.network_rules = NetworkRuleServiceAsync(self._state)
        self.networks = NetworkServiceAsync(self._state)
        self.organizations = OrganizationServiceAsync(self._state)
        self.pipelines = PipelineServiceAsync(self._state)
        self.projects = ProjectServiceAsync(self._state)
        self.resource_events = ResourceEventServiceAsync(self._state)
        self.resource_links = ResourceLinkServiceAsync(self._state)
        self.roles = RoleServiceAsync(self._state)
        self.servers = ServerServiceAsync(self._state)
        self.services = ServiceServiceAsync(self._state)
        self.social_accounts = SocialAccountServiceAsync(self._state)
        self.ssh_keys = SSHKeyServiceAsync(self._state)
        self.ssl_certificates = SSLCertificateServiceAsync(self._state)
        self.static = StaticServiceAsync(self._state)
        self.subnets = SubnetServiceAsync(self._state)
        self.teams = TeamServiceAsync(self._state)
        self.users = UserServiceAsync(self._state)
        self.variables = VariableServiceAsync(self._state)
        self.virtual_hosts = VirtualHostServiceAsync(self._state)

    def __set_api_token(self, api_token: str) -> None:
        self._state.config.api_token = api_token

    def __get_api_token(self) -> str | None:
        return self._state.config.api_token

    def __set_access_token(self, access_token: str) -> None:
        self._state.access_token = access_token

    def __get_access_token(self) -> str | None:
        return self._state.access_token

    api_token = property(fset=__set_api_token, fget=__get_api_token)
    access_token = property(fset=__set_access_token, fget=__get_access_token)
