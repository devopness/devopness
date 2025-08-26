import { ApiBaseService } from "./ApiBaseService";
import { mergeSiblingClasses } from "../common/MergeSiblingClasses";
import { ProjectsApiTokensApiService } from "../api/generated/apis/projects-api-tokens-api";
import { UsersPersonalAccessTokensApiService } from "../api/generated/apis/users-personal-access-tokens-api";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ApiTokenService extends ApiBaseService {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ApiTokenService
  extends ProjectsApiTokensApiService,
    UsersPersonalAccessTokensApiService {}

mergeSiblingClasses(ApiTokenService, [
  ProjectsApiTokensApiService,
  UsersPersonalAccessTokensApiService,
]);
