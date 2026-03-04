import { EnvironmentsActionsApiService } from '../api/generated/apis/environments-actions-api';
import { EnvironmentsApiService } from '../api/generated/apis/environments-api';

export class EnvironmentService extends EnvironmentsApiService {
    public actions = new EnvironmentsActionsApiService();
}
