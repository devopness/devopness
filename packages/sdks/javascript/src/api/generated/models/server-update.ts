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



/**
 * 
 * @export
 * @interface ServerUpdate
 */
export interface ServerUpdate {
    /**
     * The unique ID of the given server.
     * @type {number}
     * @memberof ServerUpdate
     */
    id: number;
    /**
     * Public ipv4 address for server access. This field is required when <code>provision_settings.self_hosted</code> is <code>true</code>.
     * @type {string}
     * @memberof ServerUpdate
     */
    ip_address?: string;
    /**
     * The network port to which the SSH daemon is listening to SSH connections on the server. This field is required when <code>provision_settings.self_hosted</code> is <code>true</code>.
     * @type {number}
     * @memberof ServerUpdate
     */
    ssh_port?: number;
}

