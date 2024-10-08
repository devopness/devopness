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
import { CredentialOptions } from '../../generated/models';

/**
 * StaticDataCredentialOptionsApiService - Auto-generated
 */
export class StaticDataCredentialOptionsApiService extends ApiBaseService {
    /**
     * 
     * @summary List `Credential` resource options
     */
    public async getStaticCredentialOptions(): Promise<ApiResponse<CredentialOptions>> {

        let queryString = '';

        const requestUrl = '/static/credential-options' + (queryString? `?${queryString}` : '');

        const response = await this.get <CredentialOptions>(requestUrl);
        return new ApiResponse(response);
    }
}
