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
import { Organization } from '../../generated/models';
import { OrganizationActivity } from '../../generated/models';
import { OrganizationCreate } from '../../generated/models';
import { OrganizationRelation } from '../../generated/models';
import { OrganizationUpdate } from '../../generated/models';

/**
 * OrganizationsApiService - Auto-generated
 */
export class OrganizationsApiService extends ApiBaseService {
    /**
     * 
     * @summary Create a new organization
     * @param {OrganizationCreate} organizationCreate A JSON object containing the resource data
     */
    public async addOrganization(organizationCreate: OrganizationCreate): Promise<ApiResponse<Organization>> {
        if (organizationCreate === null || organizationCreate === undefined) {
            throw new ArgumentNullException('organizationCreate', 'addOrganization');
        }

        let queryString = '';

        const requestUrl = '/organizations' + (queryString? `?${queryString}` : '');

        const response = await this.post <Organization, OrganizationCreate>(requestUrl, organizationCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get an organization by ID or URL Slug
     * @param {string} organizationId The numeric ID or URL Slug of an organization.
     */
    public async getOrganization(organizationId: string): Promise<ApiResponse<Organization>> {
        if (organizationId === null || organizationId === undefined) {
            throw new ArgumentNullException('organizationId', 'getOrganization');
        }

        let queryString = '';

        const requestUrl = '/organizations/{organization_id}' + (queryString? `?${queryString}` : '');

        const response = await this.get <Organization>(requestUrl.replace(`{${"organization_id"}}`, encodeURIComponent(String(organizationId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get activity information for an organization
     * @param {string} organizationId The numeric ID or URL Slug of an organization.
     */
    public async getOrganizationActivity(organizationId: string): Promise<ApiResponse<OrganizationActivity>> {
        if (organizationId === null || organizationId === undefined) {
            throw new ArgumentNullException('organizationId', 'getOrganizationActivity');
        }

        let queryString = '';

        const requestUrl = '/organizations/{organization_id}/activity' + (queryString? `?${queryString}` : '');

        const response = await this.get <OrganizationActivity>(requestUrl.replace(`{${"organization_id"}}`, encodeURIComponent(String(organizationId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary List all organizations of authenticated user
     * @param {number} [page] Number of the page to be retrieved
     * @param {number} [perPage] Number of items returned per page
     */
    public async listOrganizations(page?: number, perPage?: number): Promise<ApiResponse<Array<OrganizationRelation>>> {

        let queryString = '';
        const queryParams = { page: page, per_page: perPage, } as { [key: string]: any };
        for (const key in queryParams) {
            if (queryParams[key] === undefined || queryParams[key] === null) {
                continue;
            }

            queryString += (queryString? '&' : '') + `${key}=${encodeURI(queryParams[key])}`;
        }

        const requestUrl = '/organizations' + (queryString? `?${queryString}` : '');

        const response = await this.get <Array<OrganizationRelation>>(requestUrl);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Update an existing organization
     * @param {string} organizationId The numeric ID or URL Slug of an organization.
     * @param {OrganizationUpdate} organizationUpdate A JSON object containing the resource data
     */
    public async updateOrganization(organizationId: string, organizationUpdate: OrganizationUpdate): Promise<ApiResponse<void>> {
        if (organizationId === null || organizationId === undefined) {
            throw new ArgumentNullException('organizationId', 'updateOrganization');
        }
        if (organizationUpdate === null || organizationUpdate === undefined) {
            throw new ArgumentNullException('organizationUpdate', 'updateOrganization');
        }

        let queryString = '';

        const requestUrl = '/organizations/{organization_id}' + (queryString? `?${queryString}` : '');

        const response = await this.put <void, OrganizationUpdate>(requestUrl.replace(`{${"organization_id"}}`, encodeURIComponent(String(organizationId))), organizationUpdate);
        return new ApiResponse(response);
    }
}
