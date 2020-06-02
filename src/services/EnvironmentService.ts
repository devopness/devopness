import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsServersApiService } from '../api/generated/apis/environments-servers-api';

export class EnvironmentService extends EnvironmentsApiService {
    public servers = new EnvironmentsServersApiService();
}
