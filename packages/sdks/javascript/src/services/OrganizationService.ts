import { OrganizationsApiService } from "../api/generated/apis/organizations-api";
import { OrganizationsEnvironmentsApiService } from "../api/generated/apis/organizations-environments-api";

export class OrganizationService extends OrganizationsApiService {
  environments = new OrganizationsEnvironmentsApiService();
}
