import { ApiBaseService } from "./ApiBaseService";
import { mergeSiblingClasses } from "../common/MergeSiblingClasses";
import { ProjectsAPITokensApiService } from "../api/generated/apis/projects-apitokens-api";
import { UsersPersonalAccessTokensApiService } from "../api/generated/apis/users-personal-access-tokens-api";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ApiTokenService extends ApiBaseService {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ApiTokenService
  extends ProjectsAPITokensApiService,
    UsersPersonalAccessTokensApiService {}

mergeSiblingClasses(ApiTokenService, [
  ProjectsAPITokensApiService,
  UsersPersonalAccessTokensApiService,
]);
