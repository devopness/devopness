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
import { CronJob } from '../../generated/models';
import { CronJobEnvironmentCreate } from '../../generated/models';
import { CronJobRelation } from '../../generated/models';

/**
 * EnvironmentsCronJobsApiService - Auto-generated
 */
export class EnvironmentsCronJobsApiService extends ApiBaseService {
    /**
     * 
     * @summary Add a Cron Job to the given environment
     * @param {number} environmentId The ID of the environment.
     * @param {CronJobEnvironmentCreate} cronJobEnvironmentCreate A JSON object containing the resource data
     */
    public async addEnvironmentCronJob(environmentId: number, cronJobEnvironmentCreate: CronJobEnvironmentCreate): Promise<ApiResponse<CronJob>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'addEnvironmentCronJob');
        }
        if (cronJobEnvironmentCreate === null || cronJobEnvironmentCreate === undefined) {
            throw new ArgumentNullException('cronJobEnvironmentCreate', 'addEnvironmentCronJob');
        }
            
        let queryString = '';

        const requestUrl = '/environments/{environment_id}/cron-jobs' + (queryString? `?${queryString}` : '');

        const response = await this.post <CronJob, CronJobEnvironmentCreate>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))), cronJobEnvironmentCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Return a list of all Cron Jobs belonging to an environment
     * @param {number} environmentId The ID of the environment.
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listEnvironmentCronJobs(environmentId: number, page?: number, perPage?: number): Promise<ApiResponse<Array<CronJobRelation>>> {
        if (environmentId === null || environmentId === undefined) {
            throw new ArgumentNullException('environmentId', 'listEnvironmentCronJobs');
        }
            
        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/environments/{environment_id}/cron-jobs' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<CronJobRelation>>(requestUrl.replace(`{${"environment_id"}}`, encodeURIComponent(String(environmentId))));
        return new ApiResponse(response);
    }
}
