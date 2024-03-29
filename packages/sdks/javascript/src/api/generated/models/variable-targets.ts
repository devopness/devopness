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


import { VariableTarget } from './variable-target';

/**
 * The object of target defining how the variable key/value pair will be deployed
 * @export
 * @interface VariableTargets
 */
export interface VariableTargets {
    /**
     * 
     * @type {VariableTarget}
     * @memberof VariableTargets
     */
    name?: VariableTarget;
    /**
     * Human readable version of the variable target name
     * @type {string}
     * @memberof VariableTargets
     */
    name_human_readable?: string;
    /**
     * Descriptive text to help users to know what data is stored in the field and optional extra information on how to enter data to the field
     * @type {string}
     * @memberof VariableTargets
     */
    hint?: string;
}

