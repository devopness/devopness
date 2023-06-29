import { PipelinesActionsApiService } from "../api/generated/apis/pipelines-actions-api";
import { PipelinesApiService } from "../api/generated/apis/pipelines-api";
import { PipelinesStepsApiService } from "../api/generated/apis/pipelines-steps-api";

export class PipelineService extends PipelinesApiService {
    public actions = new PipelinesActionsApiService()
    public steps = new PipelinesStepsApiService();
}
