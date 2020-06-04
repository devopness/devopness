import { ApiBaseService, ConfigurationOptions, Configuration } from './services/ApiBaseService';
import { ApplicationService } from './services/ApplicationService';
import { DaemonService } from './services/DaemonService';
import { DeploymentService } from './services/DeploymentService'
import { EnvironmentService } from './services/EnvironmentService';
import { NetworkRuleService } from './services/NetworkRuleService';
import { ProjectService } from './services/ProjectService';
import { ServerService } from './services/ServerService';
import { ServiceService } from './services/ServiceService';
import { SourceProviderService } from './services/SourceProviderService'
import { SshKeyService } from './services/SshKeyService';
import { SslCertificateService } from './services/SslCertificateService';
import { UserService } from './services/UserService';
import { CronJobService } from './services/CronJobService';
import { StaticService } from './services/StaticService';

export class DevopnessApiClient {
  applications: ApplicationService;
  cronjobs: CronJobService;
  daemons: DaemonService;
  deployments: DeploymentService;
  environments: EnvironmentService;
  networkRules: NetworkRuleService;
  projects: ProjectService;
  servers: ServerService;
  services: ServiceService;
  sourceProviders: SourceProviderService;
  sshKeys: SshKeyService;
  sslCertificates: SslCertificateService;
  static: StaticService;
  users: UserService;

  /**
   * @todo provide a global onError event? How to make it easy to clients to interact with
   * this SDK without being dependant themselves on AxiosResponse types?
   * We should be the only ones concerned about axios and moving from
   * Axios to another HTTP library should not affect the consumers
   * of this SDK
   */

  constructor(options?: ConfigurationOptions) {
    ApiBaseService.configuration = new Configuration(options || {});

    // we'd better initialize the services explicitly, instead of auto initialize them on property
    // declaration in the beginning of the class, cause some (or all) of them might need constructor
    // parameters. Furthermore, we ensure all assertions for required parameters (like the
    // above check for `baseUrl`) are quickly returned to the end user before spending
    // time loading extra resources
    this.applications = new ApplicationService();
    this.cronjobs = new CronJobService();
    this.daemons = new DaemonService();
    this.deployments = new DeploymentService();
    this.environments = new EnvironmentService();
    this.networkRules = new NetworkRuleService();
    this.projects = new ProjectService();
    this.servers = new ServerService();
    this.services = new ServiceService();
    this.sourceProviders = new SourceProviderService();
    this.sshKeys = new SshKeyService();
    this.sslCertificates = new SslCertificateService();
    this.static = new StaticService();
    this.users = new UserService();
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
