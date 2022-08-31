import { ProjectsApiService } from '../api/generated/apis/projects-api';
import { ProjectsActionsApiService } from '../api/generated/apis/projects-actions-api';
import { ProjectsApplicationsApiService } from '../api/generated/apis/projects-applications-api';
import { ProjectsCronJobsApiService } from '../api/generated/apis/projects-cron-jobs-api';
import { ProjectsEnvironmentsApiService } from '../api/generated/apis/projects-environments-api';
import { ProjectsNetworkRulesApiService } from '../api/generated/apis/projects-network-rules-api';
import { ProjectsServersApiService } from '../api/generated/apis/projects-servers-api';
import { ProjectsServicesApiService } from '../api/generated/apis/projects-services-api';
import { ProjectsSSHKeysApiService } from '../api/generated/apis/projects-sshkeys-api';
import { ProjectsDaemonsApiService } from '../api/generated/apis/projects-daemons-api';
import { ProjectsRolesApiService } from '../api/generated/apis/projects-roles-api';
import { ProjectsTeamsApiService } from '../api/generated/apis/projects-teams-api';

export class ProjectService extends ProjectsApiService {
    public actions = new ProjectsActionsApiService();
    public applications = new ProjectsApplicationsApiService();
    public cronjobs = new ProjectsCronJobsApiService();
    public daemons = new ProjectsDaemonsApiService();
    public environments = new ProjectsEnvironmentsApiService();
    public networkRules = new ProjectsNetworkRulesApiService();
    public roles = new ProjectsRolesApiService();
    public servers = new ProjectsServersApiService();
    public services = new ProjectsServicesApiService();
    public sshKeys = new ProjectsSSHKeysApiService();
    public teams = new ProjectsTeamsApiService();
}
