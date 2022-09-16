import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsActionsApiService } from '../api/generated/apis/environments-actions-api';
import { EnvironmentsApplicationsApiService } from '../api/generated/apis/environments-applications-api';
import { EnvironmentsCronJobsApiService } from '../api/generated/apis/environments-cron-jobs-api';
import { EnvironmentsDaemonsApiService } from '../api/generated/apis/environments-daemons-api';
import { EnvironmentsNetworkRulesApiService } from '../api/generated/apis/environments-network-rules-api';
import { EnvironmentsServersApiService } from '../api/generated/apis/environments-servers-api';
import { EnvironmentsServicesApiService } from '../api/generated/apis/environments-services-api';
import { EnvironmentsSSHKeysApiService } from '../api/generated/apis/environments-sshkeys-api';
import { EnvironmentsTeamsApiService } from '../api/generated/apis/environments-teams-api';
import { EnvironmentsMembersApiService } from '../api/generated/apis/environments-members-api';

export class EnvironmentService extends EnvironmentsApiService {
    public actions = new EnvironmentsActionsApiService();
    public applications = new EnvironmentsApplicationsApiService();
    public cronjobs = new EnvironmentsCronJobsApiService();
    public daemons = new EnvironmentsDaemonsApiService();
    public members = new EnvironmentsMembersApiService();
    public networkRules = new EnvironmentsNetworkRulesApiService();
    public servers = new EnvironmentsServersApiService();
    public services = new EnvironmentsServicesApiService();
    public sshKeys = new EnvironmentsSSHKeysApiService();
    public teams = new EnvironmentsTeamsApiService();
}
