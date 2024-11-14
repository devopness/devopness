import { CredentialsApiService } from "../api/generated/apis/credentials-api";
import { CredentialsRepositoriesApiService } from "../api/generated/apis/credentials-repositories-api";

export class CredentialService extends CredentialsApiService {
    public repositories = new CredentialsRepositoriesApiService();
}