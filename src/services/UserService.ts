import { UsersApiService } from '../api/generated/apis/users-api';

export class UserService extends UsersApiService {
    /**
     * We auto-generate api proxy classes automatically, but it's safer to have control over exposed
     * services and methods, hence this public service class extends the generated classes, so we
     * can intercept, override or even hide generated methods.
     *
     * @todo: move services to `public` folder
     */
}
