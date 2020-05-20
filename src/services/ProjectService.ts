import { ProjectsApiService } from '../api/generated/apis/projects-api';

export class ProjectService extends ProjectsApiService {
    /**
     * We auto-generate api proxy classes automatically, but it's safer to have control over exposed
     * services and methods, hence this public service class extends the generated classes, so we
     * can intercept, override or even hide generated methods.
     *
     * @todo: move services to `public` folder
     */
}
