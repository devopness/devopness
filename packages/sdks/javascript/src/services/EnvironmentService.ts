import { EnvironmentsActionsApiService } from '../api/generated/apis/environments-actions-api';
import { EnvironmentsApiService } from '../api/generated/apis/environments-api';
import { EnvironmentsApplicationsApiService } from '../api/generated/apis/environments-applications-api';
import { EnvironmentsCredentialsApiService } from '../api/generated/apis/environments-credentials-api';
import { EnvironmentsCronJobsApiService } from '../api/generated/apis/environments-cron-jobs-api';
import { EnvironmentsDaemonsApiService } from '../api/generated/apis/environments-daemons-api';
import { EnvironmentsNetworkRulesApiService } from '../api/generated/apis/environments-network-rules-api';
import { EnvironmentsNetworksApiService } from '../api/generated/apis/environments-networks-api';
import { EnvironmentsServersApiService } from '../api/generated/apis/environments-servers-api';
import { EnvironmentsServicesApiService } from '../api/generated/apis/environments-services-api';
import { EnvironmentsSSHKeysApiService } from '../api/generated/apis/environments-sshkeys-api';
import { EnvironmentsSSLCertificatesApiService } from '../api/generated/apis/environments-sslcertificates-api';
import { EnvironmentsTeamMembershipsApiService } from '../api/generated/apis/environments-team-memberships-api';
import { EnvironmentsTeamsApiService } from '../api/generated/apis/environments-teams-api';
import { EnvironmentsVirtualHostsApiService } from '../api/generated/apis/environments-virtual-hosts-api';

export class EnvironmentService extends EnvironmentsApiService {
    public actions = new EnvironmentsActionsApiService();
    public applications = new EnvironmentsApplicationsApiService();
    public credentials = new EnvironmentsCredentialsApiService();
    public cronjobs = new EnvironmentsCronJobsApiService();
    public daemons = new EnvironmentsDaemonsApiService();
    public networks = new EnvironmentsNetworksApiService();
    public networkRules = new EnvironmentsNetworkRulesApiService();
    public servers = new EnvironmentsServersApiService();
    public services = new EnvironmentsServicesApiService();
    public sshKeys = new EnvironmentsSSHKeysApiService();
    public sslCertificates = new EnvironmentsSSLCertificatesApiService();
    public teams = new EnvironmentsTeamsApiService();
    public teamMemberships = new EnvironmentsTeamMembershipsApiService();
    public virtualHosts = new EnvironmentsVirtualHostsApiService();
}
