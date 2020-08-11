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
import { ApplicationVariable } from '../../generated/models';
import { ApplicationVariableCreate } from '../../generated/models';

/**
 * ApplicationsVariablesApiService - Auto-generated
 */
export class ApplicationsVariablesApiService extends ApiBaseService {
    /**
     * 
     * @summary Create a new variable linked to an application
     * @param {number} applicationId Unique id of the application
     * @param {ApplicationVariableCreate} applicationVariableCreate A JSON object containing application variable data
     */
    public async addVariableToApplication(applicationId: number, applicationVariableCreate: ApplicationVariableCreate): Promise<ApiResponse<ApplicationVariable>> {
        if (applicationId === null || applicationId === undefined) {
            throw new ArgumentNullException('applicationId', 'addVariableToApplication');
        }
        if (applicationVariableCreate === null || applicationVariableCreate === undefined) {
            throw new ArgumentNullException('applicationVariableCreate', 'addVariableToApplication');
        }
        const response = await this.post <ApplicationVariable, ApplicationVariableCreate>(`/applications/{application_id}/variables`.replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId))), applicationVariableCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Returns a list of variables belonging to an application
     * @param {number} applicationId Unique ID of the application to retrieve variables from
     */
    public async listApplicationVariables(applicationId: number): Promise<ApiResponse<Array<ApplicationVariable>>> {
        if (applicationId === null || applicationId === undefined) {
            throw new ArgumentNullException('applicationId', 'listApplicationVariables');
        }
        const response = await this.get <Array<ApplicationVariable>>(`/applications/{application_id}/variables`.replace(`{${"application_id"}}`, encodeURIComponent(String(applicationId))));
        return new ApiResponse(response);
    }
}
