import axios from 'axios'
import { DefaultApi as AuthApi, JWTRefresh } from 'src/api/auth'
import { logout } from 'src/composables/useAuth'

export const axiosLoginInstance = axios.create()

export const authApi = new AuthApi(undefined, '', axiosLoginInstance)

axiosLoginInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config
    if (error?.response?.status === 504) {
      /* Notify.create({
        type: 'negative',
        message: 'Сервис авторизации недоступен',
        caption: 'Ошибка',
        icon: 'feather_alert_octagon',
        timeout: 0,
        actions: [{ icon: 'feather_x' }]
      }); */
      logout()
      throw error
    } else if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true

      const refreshToken = window.localStorage.getItem('refreshToken')

      if (!refreshToken) {
        logout()
        throw error
      }
      try {
        const result = (await authApi.authControllerRefresh({ refreshToken }))
          .data as unknown as JWTRefresh
        if (result?.refreshToken) {
          window.localStorage.setItem('refreshToken', result.refreshToken)
        } else {
          window.localStorage.removeItem('refreshToken')
        }
      } catch (e) {
        console.log(e)
        logout()
      }

      return axios(config)
    }
    throw error
  })
