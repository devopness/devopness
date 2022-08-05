import { PipelinesApiService } from "../api/generated/apis/pipelines-api";
import { PipelinesResourcesApiService } from "../api/generated/apis/pipelines-resources-api";

export class PipelineService extends PipelinesApiService {
    public resources = new PipelinesResourcesApiService();
}
