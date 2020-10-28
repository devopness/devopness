import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsCronJobsApiService } from '../api/generated/apis/environments-cron-jobs-api';
import { EnvironmentsServersApiService } from '../api/generated/apis/environments-servers-api';

export class EnvironmentService extends EnvironmentsApiService {
    public cronjobs = new EnvironmentsCronJobsApiService();
    public servers = new EnvironmentsServersApiService();
}
