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


import { PipelineSettings } from './pipeline-settings';

/**
 * An operation supported by this resource type that can have pipelines associated to it.
 * @export
 * @interface ResourceOperation
 */
export interface ResourceOperation {
    /**
     * 
     * @type {string}
     * @memberof ResourceOperation
     */
    operation?: string;
    /**
     * 
     * @type {string}
     * @memberof ResourceOperation
     */
    operation_human_readable?: string;
    /**
     * 
     * @type {PipelineSettings}
     * @memberof ResourceOperation
     */
    pipeline_settings?: PipelineSettings;
}

