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
import { SslCertificate } from '../../generated/models';

/**
 * SSLCertificatesApiService - Auto-generated
 */
export class SSLCertificatesApiService extends ApiBaseService {
    /**
     * 
     * @summary Delete a SSL certificate
     * @param {number} sslCertificateId The unique id of the record to be deleted
     */
    public async deleteSslCertificate(sslCertificateId: number): Promise<ApiResponse<void>> {
        if (sslCertificateId === null || sslCertificateId === undefined) {
            throw new ArgumentNullException('sslCertificateId', 'deleteSslCertificate');
        }
        const queryString = [].join('&');
        const requestUrl = '/ssl-certificates/{ssl_certificate_id}' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"ssl_certificate_id"}}`, encodeURIComponent(String(sslCertificateId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get details of a single SSL certificate
     * @param {number} sslCertificateId Unique ID of the item to be retrieved
     */
    public async getSslCertificate(sslCertificateId: number): Promise<ApiResponse<SslCertificate>> {
        if (sslCertificateId === null || sslCertificateId === undefined) {
            throw new ArgumentNullException('sslCertificateId', 'getSslCertificate');
        }
        const queryString = [].join('&');
        const requestUrl = '/ssl-certificates/{ssl_certificate_id}' + (queryString? `?${queryString}` : '');

        const response = await this.get <SslCertificate>(requestUrl.replace(`{${"ssl_certificate_id"}}`, encodeURIComponent(String(sslCertificateId))));
        return new ApiResponse(response);
    }
}
