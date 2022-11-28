import { HooksApiService } from '../api/generated/apis/hooks-api';
import { HooksRequestsApiService } from '../api/generated/apis/hooks-requests-api';

export class HookService extends HooksApiService {
  requests = new HooksRequestsApiService()
}
