import { ApiBaseService } from './ApiBaseService';
import { mergeSiblingClasses } from '../common/MergeSiblingClasses';
import { ApplicationsApiService } from '../api/generated/apis/applications-api';
import { ApplicationsDeploymentsApiService } from '../api/generated/apis/applications-deployments-api';
import { ApplicationsVariablesApiService } from '../api/generated/apis/applications-variables-api';
import { ApplicationsHooksApiService } from '../api/generated/apis/applications-hooks-api';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ApplicationService extends ApiBaseService { }
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ApplicationService extends
    ApplicationsApiService,
    ApplicationsDeploymentsApiService,
    ApplicationsApiService,
    ApplicationsVariablesApiService,
    ApplicationsHooksApiService {
}

mergeSiblingClasses(ApplicationService, [
    ApplicationsApiService,
    ApplicationsDeploymentsApiService,
    ApplicationsVariablesApiService,
    ApplicationsHooksApiService,
]);
