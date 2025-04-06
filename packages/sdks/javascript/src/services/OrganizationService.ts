import { OrganizationsApiService } from "../api/generated/apis/organizations-api";
import { OrganizationsEnvironmentsApiService } from "../api/generated/apis/organizations-environments-api";
import { OrganizationsProjectsApiService } from "../api/generated/apis/organizations-projects-api";

export class OrganizationService extends OrganizationsApiService {
  environments = new OrganizationsEnvironmentsApiService();
  projects = new OrganizationsProjectsApiService();
}
