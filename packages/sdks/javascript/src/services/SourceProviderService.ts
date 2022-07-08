import { SourceProvidersApiService } from '../api/generated/apis/source-providers-api';
import { SourceProvidersRepositoriesApiService } from '../api/generated/apis/source-providers-repositories-api';

export class SourceProviderService extends SourceProvidersApiService {
    public repositories = new SourceProvidersRepositoriesApiService();
}
