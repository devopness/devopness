import { BaseApi, Credentials } from "../../BaseApi"; // do we really need to be nested 2 levels deep?

import { AxiosRequestConfig } from "axios";

export class ProjectApi extends BaseApi {
    public constructor(credentials?: Credentials, config?: AxiosRequestConfig) {
        super(credentials, config);

        // this.getAllProjects = this.getAllProjects.bind(this);
    }

    public getAllProjects(): Promise<any> {
        return this.get<any, any>(
            "/projects",
            {
                // name: user.name,
                // pass: user.pass
            }
        );
            // .then((res: AxiosResponse<string>) => res.data);
    }
}
