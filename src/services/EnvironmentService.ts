import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsApplicationsApiService } from '../api/generated/apis/environments-applications-api';
import { EnvironmentsCronJobsApiService } from '../api/generated/apis/environments-cron-jobs-api';
import { EnvironmentsDaemonsApiService } from '../api/generated/apis/environments-daemons-api';
import { EnvironmentsServersApiService } from '../api/generated/apis/environments-servers-api';
import { EnvironmentsServicesApiService } from '../api/generated/apis/environments-services-api';
import { EnvironmentsSSHKeysApiService } from '../api/generated/apis/environments-sshkeys-api';

export class EnvironmentService extends EnvironmentsApiService {
    public applications = new EnvironmentsApplicationsApiService();
    public cronjobs = new EnvironmentsCronJobsApiService();
    public daemons = new EnvironmentsDaemonsApiService();
    public servers = new EnvironmentsServersApiService();
    public services = new EnvironmentsServicesApiService();
    public sshKeys = new EnvironmentsSSHKeysApiService();
}
