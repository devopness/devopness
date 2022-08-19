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
import { PipelineStep } from '../../generated/models';
import { PipelineStepCreate } from '../../generated/models';

/**
 * PipelinesStepsApiService - Auto-generated
 */
export class PipelinesStepsApiService extends ApiBaseService {
    /**
     * 
     * @summary Creates a step for a pipeline
     * @param {number} pipelineId Unique ID of the pipeline to add the step to
     * @param {PipelineStepCreate} pipelineStepCreate A JSON object containing pipeline script data
     */
    public async createPipelineStep(pipelineId: number, pipelineStepCreate: PipelineStepCreate): Promise<ApiResponse<PipelineStep>> {
        if (pipelineId === null || pipelineId === undefined) {
            throw new ArgumentNullException('pipelineId', 'createPipelineStep');
        }
        if (pipelineStepCreate === null || pipelineStepCreate === undefined) {
            throw new ArgumentNullException('pipelineStepCreate', 'createPipelineStep');
        }
        
        let queryString = '';

        const requestUrl = '/pipelines/{pipeline_id}/steps' + (queryString? `?${queryString}` : '');

        const response = await this.post <PipelineStep, PipelineStepCreate>(requestUrl.replace(`{${"pipeline_id"}}`, encodeURIComponent(String(pipelineId))), pipelineStepCreate);
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Link a step to a pipeline
     * @param {number} pipelineId Unique ID of the pipeline
     * @param {number} stepId Unique ID of the step to be linked
     */
    public async linkStepToPipeline(pipelineId: number, stepId: number): Promise<ApiResponse<void>> {
        if (pipelineId === null || pipelineId === undefined) {
            throw new ArgumentNullException('pipelineId', 'linkStepToPipeline');
        }
        if (stepId === null || stepId === undefined) {
            throw new ArgumentNullException('stepId', 'linkStepToPipeline');
        }
        
        let queryString = '';

        const requestUrl = '/pipelines/{pipeline_id}/steps/{step_id}' + (queryString? `?${queryString}` : '');

        const response = await this.post <void>(requestUrl.replace(`{${"pipeline_id"}}`, encodeURIComponent(String(pipelineId))).replace(`{${"step_id"}}`, encodeURIComponent(String(stepId))));
        return new ApiResponse(response);
    }

    /**
     * 
     * @summary Unlink a step to a pipeline
     * @param {number} pipelineId Unique ID of the pipeline
     * @param {number} stepId Unique ID of the step to be unlinked
     */
    public async unlinkStepToPipeline(pipelineId: number, stepId: number): Promise<ApiResponse<void>> {
        if (pipelineId === null || pipelineId === undefined) {
            throw new ArgumentNullException('pipelineId', 'unlinkStepToPipeline');
        }
        if (stepId === null || stepId === undefined) {
            throw new ArgumentNullException('stepId', 'unlinkStepToPipeline');
        }
        
        let queryString = '';

        const requestUrl = '/pipelines/{pipeline_id}/steps/{step_id}' + (queryString? `?${queryString}` : '');

        const response = await this.delete <void>(requestUrl.replace(`{${"pipeline_id"}}`, encodeURIComponent(String(pipelineId))).replace(`{${"step_id"}}`, encodeURIComponent(String(stepId))));
        return new ApiResponse(response);
    }
}
