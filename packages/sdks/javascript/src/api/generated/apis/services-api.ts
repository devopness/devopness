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
import { Service } from '../../generated/models';
import { ServiceReload } from '../../generated/models';
import { ServiceRestart } from '../../generated/models';
import { ServiceStart } from '../../generated/models';
import { ServiceStop } from '../../generated/models';
import { ServiceUpdate } from '../../generated/models';
import { ServiceUpdateStatus } from '../../generated/models';

/**
 * ServicesApiService - Auto-generated
 */
export class ServicesApiService extends ApiBaseService {
    /**
     * 
     * @summary Delete a given service
     * @param {number} serviceId The ID of the service.
     */
    public async deleteService(serviceId: number): Promise<ApiResponse<void>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'deleteService');
        }
        
        let queryString = '';

        const requestUrl = '/services/{service_id}' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get details of a single service
     * @param {number} serviceId The ID of the service.
     */
    public async getService(serviceId: number): Promise<ApiResponse<Service>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'getService');
        }
        
        let queryString = '';

        const requestUrl = '/services/{service_id}' + (queryString? `?${queryString}` : '');

        const response = await this.get <Service>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Reload a service
     * @param {number} serviceId The ID of the service.
     * @param {ServiceReload} serviceReload A JSON object containing the resource data
     */
    public async reloadService(serviceId: number, serviceReload: ServiceReload): Promise<ApiResponse<void>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'reloadService');
        }
        if (serviceReload === null || serviceReload === undefined) {
            throw new ArgumentNullException('serviceReload', 'reloadService');
        }
        
        let queryString = '';

        const requestUrl = '/services/{service_id}/reload' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, ServiceReload>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))), serviceReload);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Restart a service
     * @param {number} serviceId The ID of the service.
     * @param {ServiceRestart} serviceRestart A JSON object containing the resource data
     */
    public async restartService(serviceId: number, serviceRestart: ServiceRestart): Promise<ApiResponse<void>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'restartService');
        }
        if (serviceRestart === null || serviceRestart === undefined) {
            throw new ArgumentNullException('serviceRestart', 'restartService');
        }
        
        let queryString = '';

        const requestUrl = '/services/{service_id}/restart' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, ServiceRestart>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))), serviceRestart);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Start a service
     * @param {number} serviceId The ID of the service.
     * @param {ServiceStart} serviceStart A JSON object containing the resource data
     */
    public async startService(serviceId: number, serviceStart: ServiceStart): Promise<ApiResponse<void>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'startService');
        }
        if (serviceStart === null || serviceStart === undefined) {
            throw new ArgumentNullException('serviceStart', 'startService');
        }
        
        let queryString = '';

        const requestUrl = '/services/{service_id}/start' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, ServiceStart>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))), serviceStart);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Stop a service
     * @param {number} serviceId The ID of the service.
     * @param {ServiceStop} serviceStop A JSON object containing the resource data
     */
    public async stopService(serviceId: number, serviceStop: ServiceStop): Promise<ApiResponse<void>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'stopService');
        }
        if (serviceStop === null || serviceStop === undefined) {
            throw new ArgumentNullException('serviceStop', 'stopService');
        }
        
        let queryString = '';

        const requestUrl = '/services/{service_id}/stop' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, ServiceStop>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))), serviceStop);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Update an existing service
     * @param {number} serviceId The ID of the service.
     * @param {ServiceUpdate} serviceUpdate A JSON object containing the resource data
     */
    public async updateService(serviceId: number, serviceUpdate: ServiceUpdate): Promise<ApiResponse<void>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'updateService');
        }
        if (serviceUpdate === null || serviceUpdate === undefined) {
            throw new ArgumentNullException('serviceUpdate', 'updateService');
        }
        
        let queryString = '';

        const requestUrl = '/services/{service_id}' + (queryString? `?${queryString}` : '');

        const response = await this.put <void, ServiceUpdate>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))), serviceUpdate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Update status of a service
     * @param {number} serviceId The ID of the service.
     * @param {ServiceUpdateStatus} serviceUpdateStatus A JSON object containing the resource data
     */
    public async updateStatusService(serviceId: number, serviceUpdateStatus: ServiceUpdateStatus): Promise<ApiResponse<void>> {
        if (serviceId === null || serviceId === undefined) {
            throw new ArgumentNullException('serviceId', 'updateStatusService');
        }
        if (serviceUpdateStatus === null || serviceUpdateStatus === undefined) {
            throw new ArgumentNullException('serviceUpdateStatus', 'updateStatusService');
        }
        
        let queryString = '';

        const requestUrl = '/services/{service_id}/update-status' + (queryString? `?${queryString}` : '');

        const response = await this.post <void, ServiceUpdateStatus>(requestUrl.replace(`{${"service_id"}}`, encodeURIComponent(String(serviceId))), serviceUpdateStatus);
        return new ApiResponse(response);
    }
}
