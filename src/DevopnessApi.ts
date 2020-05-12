import { ProjectApi } from './modules/projects/ProjectApi';

export class DevopnessApi {
  public projects: ProjectApi;

  /**
   *
   * @todo define complex type `credentials` so the `.d.ts` file is created
   * and exported
   */
  constructor(credentials: any) {
    this.projects = new ProjectApi(credentials);
  }
}
