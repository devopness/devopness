import { PipelinesApiService } from "../api/generated/apis/pipelines-api";
import { PipelinesResourcesApiService } from "../api/generated/apis/pipelines-resources-api";
import { PipelinesStepsApiService } from "../api/generated/apis/pipelines-steps-api";

export class PipelineService extends PipelinesApiService {
    public resources = new PipelinesResourcesApiService();
    public steps = new PipelinesStepsApiService();
}
