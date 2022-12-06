import { StaticDataApiService } from "../api/generated/apis/static-data-api";
import { StaticDataApplicationOptionsApiService } from "../api/generated/apis/static-data-application-options-api";
import { StaticDataCloudProviderOptionsApiService } from "../api/generated/apis/static-data-cloud-provider-options-api";
import { StaticDataCloudProviderServiceInstancesApiService } from "../api/generated/apis/static-data-cloud-provider-service-instances-api";
import { StaticDataCloudProviderServicesApiService } from "../api/generated/apis/static-data-cloud-provider-services-api";

export class StaticService extends StaticDataApiService {
  public applicationOptions = new StaticDataApplicationOptionsApiService();
  public cloudProviderOptions = new StaticDataCloudProviderOptionsApiService();
  public cloudProviderServiceInstances = new StaticDataCloudProviderServiceInstancesApiService();
  public cloudProviderServices = new StaticDataCloudProviderServicesApiService();
}
