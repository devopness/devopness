/* eslint-disable */
/**
 * devopness API
 * Devopness API - Painless essential DevOps to everyone 
 *
 * The version of the OpenAPI document: latest
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { ApiBaseService } from "../../../services/ApiBaseService";
import { ApiResponse } from "../../../common/ApiResponse";
import { ArgumentNullException } from "../../../common/Exceptions";
import { ApiError } from '../../generated/models';
import { Role } from '../../generated/models';
import { RoleProjectCreate } from '../../generated/models';
import { RoleRelation } from '../../generated/models';

/**
 * ProjectsRolesApiService - Auto-generated
 */
export class ProjectsRolesApiService extends ApiBaseService {
    /**
     * 
     * @summary Create a role to a given project
     * @param {number} projectId The ID of the project.
     * @param {RoleProjectCreate} roleProjectCreate A JSON object containing the resource data
     */
    public async addProjectRole(projectId: number, roleProjectCreate: RoleProjectCreate): Promise<ApiResponse<Role>> {
        if (projectId === null || projectId === undefined) {
            throw new ArgumentNullException('projectId', 'addProjectRole');
        }
        if (roleProjectCreate === null || roleProjectCreate === undefined) {
            throw new ArgumentNullException('roleProjectCreate', 'addProjectRole');
        }

        let queryString = '';

        const requestUrl = '/projects/{project_id}/roles' + (queryString? `?${queryString}` : '');

        const response = await this.post <Role, RoleProjectCreate>(requestUrl.replace(`{${"project_id"}}`, encodeURIComponent(String(projectId))), roleProjectCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary List all roles from a project
     * @param {number} projectId The ID of the project.
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listProjectRoles(projectId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<RoleRelation>>> {
        if (projectId === null || projectId === undefined) {
            throw new ArgumentNullException('projectId', 'listProjectRoles');
        }

        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/projects/{project_id}/roles' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<RoleRelation>>(requestUrl.replace(`{${"project_id"}}`, encodeURIComponent(String(projectId))));
        return new ApiResponse(response);
    }
}
