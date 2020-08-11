/* eslint-disable */
/**
 * devopness API
 * Devopness API - Painless essential DevOps to everyone  # Authentication  <!-- ReDoc-Inject: <security-definitions> -->
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
 * @interface ScriptUpdate
 */
export interface ScriptUpdate {
    /**
     * The id of the application to be linked
     * @type {number}
     * @memberof ScriptUpdate
     */
    application_id?: number;
    /**
     * The type of the script
     * @type {string}
     * @memberof ScriptUpdate
     */
    type?: string;
    /**
     * Name/short description of the script
     * @type {string}
     * @memberof ScriptUpdate
     */
    name: string;
    /**
     * A command line or multiline bash script
     * @type {string}
     * @memberof ScriptUpdate
     */
    source_code: string;
    /**
     * The name of the Unix user on behalf of which the script will be executed
     * @type {string}
     * @memberof ScriptUpdate
     */
    run_as_user: string;
    /**
     * The type of event that will trigger the script execution
     * @type {string}
     * @memberof ScriptUpdate
     */
    trigger_type: ScriptUpdateTriggerTypeEnum;
    /**
     * The application deployment event to which the script is attached
     * @type {string}
     * @memberof ScriptUpdate
     */
    trigger_event: ScriptUpdateTriggerEventEnum;
    /**
     * The relative order of the script execution in case the event has multiple scripts attached
     * @type {number}
     * @memberof ScriptUpdate
     */
    trigger_order: number;
}

/**
    * @export
    * @enum {string}
    */
export enum ScriptUpdateTriggerTypeEnum {
    Before = 'before',
    After = 'after'
}
/**
    * @export
    * @enum {string}
    */
export enum ScriptUpdateTriggerEventEnum {
    GetNewRelease = 'get-new-release',
    InstallDependencies = 'install-dependencies',
    ActivateNewRelease = 'activate-new-release',
    RemoveOldReleases = 'remove-old-releases'
}


