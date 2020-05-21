import { DevopnessApiClient } from 'devopness-sdk-js'

const DEVOPNESS_API_BASE_URL = 'https://test-api.devopness.com'
const devopnessApi = new DevopnessApiClient({ baseUrl: DEVOPNESS_API_BASE_URL })

export const login = (email, password) => {
  const userCredentials = {
    email,
    password
  }

  const userToken = devopnessApi.users.login(userCredentials)

  return userToken
}
