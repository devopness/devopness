import { DevopnessApiClient } from '@devopness/sdk-js'

const DEVOPNESS_API_BASE_URL = 'https://dev-api.devopness.com'

export const devopnessApi = new DevopnessApiClient({ baseURL: DEVOPNESS_API_BASE_URL })
