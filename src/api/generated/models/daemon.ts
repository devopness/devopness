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


import { Action } from './action';
import { ActionStatus } from './action-status';
import { Application } from './application';
import { Project } from './project';

/**
 * 
 * @export
 * @interface Daemon
 */
export interface Daemon {
    /**
     * The Id of the given daemon
     * @type {number}
     * @memberof Daemon
     */
    id?: number;
    /**
     * The name entered by the user (or auto-generated by `devopness`) to uniquely identify the daemon
     * @type {string}
     * @memberof Daemon
     */
    name: string;
    /**
     * The command line to be executed to start the daemon
     * @type {string}
     * @memberof Daemon
     */
    command: string;
    /**
     * The working directory where the daemon will be relative to when performing disk i/o
     * @type {string}
     * @memberof Daemon
     */
    working_directory: string;
    /**
     * The number of daemon process instances of the program to run simultaneously
     * @type {number}
     * @memberof Daemon
     */
    process_count: number;
    /**
     * The name of the Unix user on behalf of which the daemon will run
     * @type {string}
     * @memberof Daemon
     */
    run_as_user: string;
    /**
     * Indicates if the command was auto_generated by `devopness` itself
     * @type {boolean}
     * @memberof Daemon
     */
    auto_generated?: boolean;
    /**
     * 
     * @type {ActionStatus}
     * @memberof Daemon
     */
    status?: ActionStatus;
    /**
     * 
     * @type {Project}
     * @memberof Daemon
     */
    project?: Project;
    /**
     * 
     * @type {Application}
     * @memberof Daemon
     */
    application?: Application | null;
    /**
     * 
     * @type {Action}
     * @memberof Daemon
     */
    last_action?: Action | null;
    /**
     * The date and time when the record was created
     * @type {string}
     * @memberof Daemon
     */
    created_at?: string;
    /**
     * The date and time when the record was last updated
     * @type {string}
     * @memberof Daemon
     */
    updated_at?: string;
}

