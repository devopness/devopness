import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsApplicationsApiService } from '../api/generated/apis/environments-applications-api';
import { EnvironmentsCronJobsApiService } from '../api/generated/apis/environments-cron-jobs-api';
import { EnvironmentsDaemonsApiService } from '../api/generated/apis/environments-daemons-api';
import { EnvironmentsNetworkRulesApiService } from '../api/generated/apis/environments-network-rules-api';
import { EnvironmentsServersApiService } from '../api/generated/apis/environments-servers-api';
import { EnvironmentsSSHKeysApiService } from '../api/generated/apis/environments-sshkeys-api';

export class EnvironmentService extends EnvironmentsApiService {
    public applications = new EnvironmentsApplicationsApiService();
    public cronjobs = new EnvironmentsCronJobsApiService();
    public daemons = new EnvironmentsDaemonsApiService();
    public networkRules = new EnvironmentsNetworkRulesApiService();
    public servers = new EnvironmentsServersApiService();
    public sshKeys = new EnvironmentsSSHKeysApiService();
}
