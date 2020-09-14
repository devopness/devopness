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
import { ExtraBodyParams } from '../../generated/models';
import { Server } from '../../generated/models';
import { ServerCommands } from '../../generated/models';
import { ServerConnect } from '../../generated/models';

/**
 * ServersApiService - Auto-generated
 */
export class ServersApiService extends ApiBaseService {
    /**
     * 
     * @summary Connect a server to devopness platform
     * @param {number} serverId The server numeric Id
     * @param {string} activationToken The server activation token
     * @param {ExtraBodyParams} [extraBodyParams] A JSON object containing list of additional parameters
     */
    public async connectServer(serverId: number, activationToken: string, extraBodyParams?: ExtraBodyParams): Promise<ApiResponse<ServerConnect>> {
        if (serverId === null || serverId === undefined) {
            throw new ArgumentNullException('serverId', 'connectServer');
        }
        if (activationToken === null || activationToken === undefined) {
            throw new ArgumentNullException('activationToken', 'connectServer');
        }
        const queryString = [].join('&');

        const response = await this.post <ServerConnect, ExtraBodyParams>(`/servers/{server_id}/connect/{activation_token}?${queryString}`.replace(`{${"server_id"}}`, encodeURIComponent(String(serverId))).replace(`{${"activation_token"}}`, encodeURIComponent(String(activationToken))), extraBodyParams);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get a server by ID
     * @param {number} serverId Numeric ID of the server to get
     */
    public async getServer(serverId: number): Promise<ApiResponse<Server>> {
        if (serverId === null || serverId === undefined) {
            throw new ArgumentNullException('serverId', 'getServer');
        }
        const queryString = [].join('&');

        const response = await this.get <Server>(`/servers/{server_id}?${queryString}`.replace(`{${"server_id"}}`, encodeURIComponent(String(serverId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Get commands to be executed on the given server
     * @param {number} serverId The server numeric Id
     */
    public async getServerCommands(serverId: number): Promise<ApiResponse<ServerCommands>> {
        if (serverId === null || serverId === undefined) {
            throw new ArgumentNullException('serverId', 'getServerCommands');
        }
        const queryString = [].join('&');

        const response = await this.get <ServerCommands>(`/servers/{server_id}/commands?${queryString}`.replace(`{${"server_id"}}`, encodeURIComponent(String(serverId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Return a list of all servers belonging to current user
     */
    public async listServers(): Promise<ApiResponse<Array<Server>>> {
        const queryString = [].join('&');

        const response = await this.get <Array<Server>>(`/servers?${queryString}`);
        return new ApiResponse(response);
    }
}
