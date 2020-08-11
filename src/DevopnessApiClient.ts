import { ApiBaseService, ConfigurationOptions, Configuration } from './services/ApiBaseService';
import { ApplicationService } from './services/ApplicationService';
import { DaemonService } from './services/DaemonService';
import { DeploymentService } from './services/DeploymentService'
import { EnvironmentService } from './services/EnvironmentService';
import { NetworkRuleService } from './services/NetworkRuleService';
import { ProjectService } from './services/ProjectService';
import { ScriptService } from './services/ScriptService';
import { ServerService } from './services/ServerService';
import { ServiceService } from './services/ServiceService';
import { SourceProviderService } from './services/SourceProviderService'
import { SshKeyService } from './services/SshKeyService';
import { SslCertificateService } from './services/SslCertificateService';
import { UserService } from './services/UserService';
import { CronJobService } from './services/CronJobService';
import { StaticService } from './services/StaticService';
import { ActionsApiService } from './api/generated/apis/actions-api';
import { SocialAccountService } from './services/SocialAccountService';
import { LogService } from './services/LogService';
import { VariableService } from './services/VariableService';

export class DevopnessApiClient {
  actions: ActionsApiService;
  applications: ApplicationService;
  cronjobs: CronJobService;
  daemons: DaemonService;
  deployments: DeploymentService;
  environments: EnvironmentService;
  logs: LogService;
  networkRules: NetworkRuleService;
  projects: ProjectService;
  scripts: ScriptService;
  servers: ServerService;
  services: ServiceService;
  socialAccounts: SocialAccountService;
  sourceProviders: SourceProviderService;
  sshKeys: SshKeyService;
  sslCertificates: SslCertificateService;
  static: StaticService;
  users: UserService;
  variables: VariableService;

  constructor(options?: ConfigurationOptions) {
    ApiBaseService.configuration = new Configuration(options || {});

    // we initialize the services explicitly, instead of auto initialize them on property declaration in the beginning of the class,
    // cause some (or all) of them depend on `ApiBaseService.configuration` property be set. Furthermore, we ensure all assertions
    // for non provided required parameters are quickly returned to the end user before spending time loading extra resources
    this.actions = new ActionsApiService();
    this.applications = new ApplicationService();
    this.cronjobs = new CronJobService();
    this.daemons = new DaemonService();
    this.deployments = new DeploymentService();
    this.environments = new EnvironmentService();
    this.logs = new LogService();
    this.networkRules = new NetworkRuleService();
    this.projects = new ProjectService();
    this.scripts = new ScriptService();
    this.servers = new ServerService();
    this.services = new ServiceService();
    this.socialAccounts = new SocialAccountService();
    this.sourceProviders = new SourceProviderService();
    this.sshKeys = new SshKeyService();
    this.sslCertificates = new SslCertificateService();
    this.static = new StaticService();
    this.users = new UserService();
    this.variables = new VariableService();
  }

  public get accessToken(): string {
    return ApiBaseService.accessToken;
  }

  public set accessToken(accessToken: string) {
    const MIN_TOKEN_LENGHT = 100;

    /**
     * As a complete access token validation rule might be too much to be implemented here, we
     * at least check for min length and return a substring of it to help users identify the
     * issue when first initializing this SDK from their apps
     */
    if (accessToken && accessToken.length < MIN_TOKEN_LENGHT) {
      throw new Error(`"${accessToken.substring(0, 10)} ..." doesn't seem to be a valid access token issued by Devopness API.`);
    }

    ApiBaseService.accessToken = accessToken;
  }
}
