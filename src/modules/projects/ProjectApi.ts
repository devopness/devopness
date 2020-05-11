import { BaseApi } from "../../BaseApi"; // do we really need to be nested 2 levels deep?

import { AxiosRequestConfig, AxiosResponse } from "axios";

export class ProjectApi extends BaseApi {
    public constructor(credentials?: any, config?: AxiosRequestConfig) {
        super(credentials, config);

        // this.getAllProjects = this.getAllProjects.bind(this);
    }

    public getAllProjects() {
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
