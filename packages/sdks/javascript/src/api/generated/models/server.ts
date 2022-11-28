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


import { ActionRelation } from './action-relation';
import { ActionStatus } from './action-status';
import { EnvironmentRelation } from './environment-relation';
import { ProjectRelation } from './project-relation';
import { ServerBlueprint } from './server-blueprint';
import { UserRelation } from './user-relation';

/**
 * 
 * @export
 * @interface Server
 */
export interface Server {
    /**
     * The unique id of the given record
     * @type {number}
     * @memberof Server
     */
    id: number;
    /**
     * The id of the user who created the server and to whom the server belongs
     * @type {number}
     * @memberof Server
     */
    created_by: number;
    /**
     * The server\'s name
     * @type {string}
     * @memberof Server
     */
    name: string;
    /**
     * The server\'s hostname
     * @type {string}
     * @memberof Server
     */
    hostname: string;
    /**
     * The name of the server\'s provider.
     * @type {string}
     * @memberof Server
     */
    provider_name: string;
    /**
     * The human readable version of the provider\'s name
     * @type {string}
     * @memberof Server
     */
    provider_name_human_readable: string;
    /**
     * Public ipv4 address for server access
     * @type {string}
     * @memberof Server
     */
    ip_address: string;
    /**
     * The network port to which the SSH daemon is listening to SSH connections on the server
     * @type {number}
     * @memberof Server
     */
    ssh_port: number;
    /**
     * Tells if the server is active or not
     * @type {boolean}
     * @memberof Server
     */
    active: boolean;
    /**
     * 
     * @type {ActionStatus}
     * @memberof Server
     */
    status: ActionStatus;
    /**
     * 
     * @type {ServerBlueprint}
     * @memberof Server
     */
    blueprint: ServerBlueprint;
    /**
     * 
     * @type {UserRelation}
     * @memberof Server
     */
    created_by_user: UserRelation;
    /**
     * 
     * @type {ProjectRelation}
     * @memberof Server
     */
    project: ProjectRelation | null;
    /**
     * 
     * @type {ActionRelation}
     * @memberof Server
     */
    last_action: ActionRelation | null;
    /**
     * 
     * @type {EnvironmentRelation}
     * @memberof Server
     */
    environment: EnvironmentRelation;
    /**
     * 
     * @type {Array<EnvironmentRelation>}
     * @memberof Server
     */
    environments: Array<EnvironmentRelation>;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof Server
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof Server
     */
    updated_at: string;
}

