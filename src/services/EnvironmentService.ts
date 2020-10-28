import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsApplicationsApiService } from '../api/generated/apis/environments-applications-api';
import { EnvironmentsCronJobsApiService } from '../api/generated/apis/environments-cron-jobs-api';
import { EnvironmentsServersApiService } from '../api/generated/apis/environments-servers-api';

export class EnvironmentService extends EnvironmentsApiService {
    public applications = new EnvironmentsApplicationsApiService();
    public cronjobs = new EnvironmentsCronJobsApiService();
    public servers = new EnvironmentsServersApiService();
}
