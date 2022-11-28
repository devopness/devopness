import { ServicesApiService } from '../api/generated/apis/services-api';
import { ServicesVariablesApiService } from '../api/generated/apis/services-variables-api';

export class ServiceService extends ServicesApiService {
    public variables = new ServicesVariablesApiService();
}
