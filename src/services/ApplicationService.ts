import { ApiBaseService } from './ApiBaseService';
import { ApplicationsApiService } from '../api/generated/apis/applications-api';
import { ApplicationsDeploymentsApiService } from '../api/generated/apis/applications-deployments-api';
import { ApplicationsEnvironmentsApiService } from '../api/generated/apis/applications-environments-api';
import { ApplicationsSSLCertificatesApiService } from '../api/generated/apis/applications-sslcertificates-api';
import { applyMixins } from '../common/Mixins';

export class ApplicationService extends ApiBaseService {}
export interface ApplicationService extends
    ApplicationsApiService,
    ApplicationsDeploymentsApiService,
    ApplicationsEnvironmentsApiService,
    ApplicationsSSLCertificatesApiService {}

applyMixins(ApplicationService, [
    ApplicationsApiService, 
    ApplicationsDeploymentsApiService,
    ApplicationsEnvironmentsApiService,
    ApplicationsSSLCertificatesApiService
]);
