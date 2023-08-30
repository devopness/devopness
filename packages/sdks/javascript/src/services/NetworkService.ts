import { NetworksApiService } from "../api/generated/apis/networks-api";
import { NetworksSubnetsApiService } from "../api/generated/apis/networks-subnets-api";

export class NetworkService extends NetworksApiService {
    public subnets = new NetworksSubnetsApiService();
}
