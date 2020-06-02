import { SourceProvidersApiService } from '../api/generated/apis/source-providers-api';
import { SourceProvidersRepositoriesApiService } from '../api/generated/apis/source-providers-repositories-api';

export class SourceProvidersService extends SourceProvidersApiService {
    public repositories = new SourceProvidersRepositoriesApiService();
}
