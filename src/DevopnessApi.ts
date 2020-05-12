import { BaseApi } from "./BaseApi";
import { ProjectApi } from './modules/projects/ProjectApi';

export class DevopnessApi {
  public projects: ProjectApi;

  /**
   *
   * @todo define complex type `credentials` so the `.d.ts` file is created
   * and exported
   */
  constructor(apiBaseUrl: string, credentials: any) {
    BaseApi.baseUrl = apiBaseUrl;
    this.projects = new ProjectApi(credentials);
  }
}
