// import { ProjectApi } from './modules/projects/ProjectApi';
import { UserService } from './services/UserService';
import { ApiBaseService, ConfigurationOptions, Configuration } from './services/ApiBaseService';

export class DevopnessApiClient {
  public users: UserService;

  /**
   * @todo provide a global onError event? How to make it easy to clients to interact with
   * this SDK without being dependant themselves on AxiosResponse types?
   * We should be the only ones concerned about axios and moving from
   * Axios to another HTTP library should not affect the consumers
   * of this SDK
   */

  constructor(options: ConfigurationOptions) {
    if (options === undefined) {
      throw new Error('API services cannot be initialized: Configuration options must be provided');
    }

    if (options.baseUrl == undefined || options.baseUrl == '') {
      throw new Error('API services cannot be initialized: base URL must be provided');
    }

    // if we want to auto login or understand that there is no use case for loading the API and check
    // login immediatelly, then we'd need to check for credentials upfront:
    // if (options.accessToken == undefined && (options.email == undefined || options.password == undefined)) {
    //   throw new Error('API services cannot be initialized: either a valid access token or username/password credentials must be provided');
    // }

    ApiBaseService.configuration = new Configuration(options);

    // we'd better initialize the services explicitly, instead of auto initialize them on property
    // declaration in the beginning of the class, cause some (or all) of them might need constructor
    // parameters. Furthermore, we ensure all assertions for required parameters (like the
    // above check for `baseUrl`) are quickly returned to the end user before spending
    // time loading extra resources
    this.users = new UserService();
  }
}
