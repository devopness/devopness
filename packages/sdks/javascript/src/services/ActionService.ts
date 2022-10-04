import { ActionsApiService } from "../api/generated/apis/actions-api";
import { ActionsResourcesApiService } from "../api/generated/apis/actions-resources-api";

export class ActionService extends ActionsApiService {
    public resources = new ActionsResourcesApiService();
}
