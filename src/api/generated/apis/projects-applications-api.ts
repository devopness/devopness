/* eslint-disable */
/**
 * devopness API
 * Devopness API - Painless essential DevOps to everyone  # Authentication  <!-- ReDoc-Inject: <security-definitions> -->
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
import { Application } from '../../generated/models';
import { ApplicationCreate } from '../../generated/models';

/**
 * ProjectsApplicationsApiService - Auto-generated
 */
export class ProjectsApplicationsApiService extends ApiBaseService {
    /**
     * 
     * @summary Create a new application
     * @param {number} projectId Numeric ID of the project to which the application will be added
     * @param {ApplicationCreate} applicationCreate A JSON object containing project data
     */
    public async addApplicationToProject(projectId: number, applicationCreate: ApplicationCreate): Promise<ApiResponse<Application>> {
        if (projectId === null || projectId === undefined) {
            throw new ArgumentNullException('projectId', 'addApplicationToProject');
        }
        if (applicationCreate === null || applicationCreate === undefined) {
            throw new ArgumentNullException('applicationCreate', 'addApplicationToProject');
        }
        const response = await this.post <Application, ApplicationCreate>(`/projects/{project_id}/applications`.replace(`{${"project_id"}}`, encodeURIComponent(String(projectId))), applicationCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Returns a list of all applications belonging to a project
     * @param {number} projectId Numeric ID of the project to get applications from
     */
    public async listProjectApplications(projectId: number): Promise<ApiResponse<Array<Application>>> {
        if (projectId === null || projectId === undefined) {
            throw new ArgumentNullException('projectId', 'listProjectApplications');
        }
        const response = await this.get <Array<Application>>(`/projects/{project_id}/applications`.replace(`{${"project_id"}}`, encodeURIComponent(String(projectId))));
        return new ApiResponse(response);
    }
}
