import { authApi, axiosInstance } from 'src/api/api'
import { REFRESH_TOKEN_STORE_NAME } from 'src/utils/const'
import { JWTRefresh } from 'src/api/auth'
import axios from 'axios'
import { useAuth } from 'src/composables/useAuth'

export function addInterceptors () {
  const { logout } = useAuth()
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config

      if (error?.response?.status === 504) {
        await logout()

        throw error
      } else if (error?.response?.status === 401 && !config?.sent) {
        config.sent = true

        const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORE_NAME)

        if (!refreshToken) {
          await logout()
          throw error
        }
        try {
          const result = (await authApi.authControllerRefresh({ refreshToken }))
            .data as unknown as JWTRefresh
          if (result?.refreshToken) {
            window.localStorage.setItem(REFRESH_TOKEN_STORE_NAME, result.refreshToken)
          } else {
            window.localStorage.removeItem(REFRESH_TOKEN_STORE_NAME)
          }
        } catch (e) {
          console.log(e)
          await logout()
        }

        return axios(config)
      }
      throw error
    })
}
