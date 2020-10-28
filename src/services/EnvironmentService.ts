import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsCronJobsApiService } from '../api/generated/apis/environments-cron-jobs-api';
import { EnvironmentsDaemonsApiService } from '../api/generated/apis/environments-daemons-api';
import { EnvironmentsServersApiService } from '../api/generated/apis/environments-servers-api';

export class EnvironmentService extends EnvironmentsApiService {
    public cronjobs = new EnvironmentsCronJobsApiService();
    public daemons = new EnvironmentsDaemonsApiService();
    public servers = new EnvironmentsServersApiService();
}
