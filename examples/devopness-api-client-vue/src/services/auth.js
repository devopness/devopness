import { devopnessApi } from './api'

export default {
  login: (email, password) => {
    try {
      const userCredentials = {
        email,
        password
      }

      const userToken = devopnessApi.users.login(userCredentials)

      return userToken
    } catch (error) {
      throw error
    }
  }
}
