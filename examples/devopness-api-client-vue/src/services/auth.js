import { devopnessApi } from './api'

export default {
  login: (email, password) => {
      const userCredentials = {
        email,
        password
      }

      const userToken = devopnessApi.users.login(userCredentials)

      return userToken
  },
}
