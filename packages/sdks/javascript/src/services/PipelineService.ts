import { PipelinesActionsApiService } from "../api/generated/apis/pipelines-actions-api";
import { PipelinesHooksApiService } from "../api/generated/apis/pipelines-hooks-api";
import { PipelinesStepsApiService } from "../api/generated/apis/pipelines-steps-api";
import { PipelinesApiService } from "../api/generated/apis/pipelines-api";

export class PipelineService extends PipelinesApiService {
    public actions = new PipelinesActionsApiService();
    public hooks = new PipelinesHooksApiService();
    public steps = new PipelinesStepsApiService();
}
