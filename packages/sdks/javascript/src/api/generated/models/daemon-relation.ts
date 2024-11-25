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
import { ApplicationRelation } from './application-relation';
import { UserRelation } from './user-relation';

/**
 * 
 * @export
 * @interface DaemonRelation
 */
export interface DaemonRelation {
    /**
     * The ID of the given daemon
     * @type {number}
     * @memberof DaemonRelation
     */
    id: number;
    /**
     * The name entered by the user (or auto-generated by `devopness`) to uniquely identify the daemon
     * @type {string}
     * @memberof DaemonRelation
     */
    name: string;
    /**
     * The command line to be executed to start the daemon
     * @type {string}
     * @memberof DaemonRelation
     */
    command: string;
    /**
     * The name of the Unix user on behalf of which the daemon will be executed
     * @type {string}
     * @memberof DaemonRelation
     */
    run_as_user: string;
    /**
     * The working directory where the Daemon command will be executed. If the Daemon is linked to an application, the path must be a relative path to the application root directory. If the Daemon is not linked to an application, the value must be an absolute path. Must not be greater than 255 characters
     * @type {string}
     * @memberof DaemonRelation
     */
    working_directory: string | null;
    /**
     * The number of daemon process instances of the program to run simultaneously
     * @type {number}
     * @memberof DaemonRelation
     */
    process_count: number;
    /**
     * Indicates if the daemon was auto_generated by `devopness` itself
     * @type {boolean}
     * @memberof DaemonRelation
     */
    is_auto_generated: boolean;
    /**
     * 
     * @type {ActionRelation}
     * @memberof DaemonRelation
     */
    last_action: ActionRelation | null;
    /**
     * 
     * @type {ApplicationRelation}
     * @memberof DaemonRelation
     */
    application: ApplicationRelation | null;
    /**
     * 
     * @type {UserRelation}
     * @memberof DaemonRelation
     */
    created_by_user: UserRelation;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof DaemonRelation
     */
    created_at: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof DaemonRelation
     */
    updated_at: string;
}

