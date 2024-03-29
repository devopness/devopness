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
import { VirtualHostOptions } from '../../generated/models';

/**
 * StaticDataVirtualHostOptionsApiService - Auto-generated
 */
export class StaticDataVirtualHostOptionsApiService extends ApiBaseService {
    /**
     * 
     * @summary List `Virtual Host` options
     */
    public async getStaticVirtualHostOptions(): Promise<ApiResponse<VirtualHostOptions>> {

        let queryString = '';

        const requestUrl = '/static/virtual-host-options' + (queryString? `?${queryString}` : '');

        const response = await this.get <VirtualHostOptions>(requestUrl);
        return new ApiResponse(response);
    }
}
