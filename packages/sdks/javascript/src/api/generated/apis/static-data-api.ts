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
import { StaticNetworkRuleOption } from '../../generated/models';

/**
 * StaticDataApiService - Auto-generated
 */
export class StaticDataApiService extends ApiBaseService {
    /**
     * 
     * @summary List `Network Rule` options
     */
    public async getStaticNetworkRuleOptions(): Promise<ApiResponse<StaticNetworkRuleOption>> {
        
        let queryString = '';

        const requestUrl = '/static/network-rule-options' + (queryString? `?${queryString}` : '');

        const response = await this.get <StaticNetworkRuleOption>(requestUrl);
        return new ApiResponse(response);
    }
}