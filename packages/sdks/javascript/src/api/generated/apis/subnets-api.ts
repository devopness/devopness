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
import { Subnet } from '../../generated/models';

/**
 * SubnetsApiService - Auto-generated
 */
export class SubnetsApiService extends ApiBaseService {
    /**
     * 
     * @summary Delete a given subnet
     * @param {number} subnetId The ID of the subnet.
     */
    public async deleteSubnet(subnetId: number): Promise<ApiResponse<void>> {
        if (subnetId === null || subnetId === undefined) {
            throw new ArgumentNullException('subnetId', 'deleteSubnet');
        }

        let queryString = '';

        const requestUrl = '/subnets/{subnet_id}' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"subnet_id"}}`, encodeURIComponent(String(subnetId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get a subnet by ID
     * @param {number} subnetId The ID of the subnet.
     */
    public async getSubnet(subnetId: number): Promise<ApiResponse<Subnet>> {
        if (subnetId === null || subnetId === undefined) {
            throw new ArgumentNullException('subnetId', 'getSubnet');
        }

        let queryString = '';

        const requestUrl = '/subnets/{subnet_id}' + (queryString? `?${queryString}` : '');

        const response = await this.get <Subnet>(requestUrl.replace(`{${"subnet_id"}}`, encodeURIComponent(String(subnetId))));
        return new ApiResponse(response);
    }
}
