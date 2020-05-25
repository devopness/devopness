import { ApiBaseService, ConfigurationOptions, Configuration } from './services/ApiBaseService';
import { ProjectService } from './services/ProjectService';
import { UserService } from './services/UserService';

export class DevopnessApiClient {
  public projects: ProjectService;
  public users: UserService;

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
    this.projects = new ProjectService();
    this.users = new UserService();
  }

  public get baseURL(): string {
    // all baseURLs should be the same anyways
    return this.projects.baseURL;
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
