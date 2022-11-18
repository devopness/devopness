import { PipelinesApiService } from "../api/generated/apis/pipelines-api";
import { PipelinesStepsApiService } from "../api/generated/apis/pipelines-steps-api";

export class PipelineService extends PipelinesApiService {
    public steps = new PipelinesStepsApiService();
}
