import { ApiBaseService } from './ApiBaseService';
import { HooksIncomingApiService } from '../api/generated/apis/hooks-incoming-api';
import { HooksIncomingRequestsApiService } from '../api/generated/apis/hooks-incoming-requests-api';
import { mergeSiblingClasses } from '../common/MergeSiblingClasses';

export class HookIncomingService extends ApiBaseService { }

export interface HookIncomingService extends
    HooksIncomingApiService,
    HooksIncomingRequestsApiService {
}

mergeSiblingClasses(HookIncomingService, [
    HooksIncomingApiService,
    HooksIncomingRequestsApiService,
]);
