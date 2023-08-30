import { ref } from 'vue'
import { Router, useRouter } from 'vue-router'
import { authApi, axiosLoginInstance } from 'src/api/api'
import { JWTRefresh, UsersControllerGetAllOrderEnum } from 'src/api/auth'
import axios from 'axios'

export function useAuth () {
  const users = ref([])
  const router = useRouter()
  const postLogin = async (login:string, password:string) => {
    const sessionId = `${Date.now()}_${Math.trunc(Math.random() * 1000)}`
    const token = await authApi.authControllerLogin({ password, login, sessionId })

    window.localStorage.setItem('refreshToken', token.data.refreshToken)

    console.log('router', router)
    await router.push('/')
  }
  const fetchUsers = async ({
    limit = 100,
    offset = 0,
    sort = 'firstName',
    order = UsersControllerGetAllOrderEnum.Asc,
    search = undefined
  }) => {
    const response = await authApi.usersControllerGetAll(limit, offset, sort, order, search)
    users.value = response.data.items
    console.log('users', users.value)
  }
  return {
    fetchUsers,
    postLogin,
    users
  }
}

export function logout (router:Router) {
  window.localStorage.removeItem('refreshToken')
  router.push('/login')
}

export function addInterceptors () {
  const router = useRouter()
  axiosLoginInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config
      console.log('rejected', error)
      console.log('router', router)

      if (error?.response?.status === 504) {
        /* Notify.create({
          type: 'negative',
          message: 'Сервис авторизации недоступен',
          caption: 'Ошибка',
          icon: 'feather_alert_octagon',
          timeout: 0,
          actions: [{ icon: 'feather_x' }]
        }); */
        logout(router)

        throw error
      } else if (error?.response?.status === 401 && !config?.sent) {
        config.sent = true

        const refreshToken = window.localStorage.getItem('refreshToken')

        if (!refreshToken) {
          logout(router)
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
          logout(router)
        }

        return axios(config)
      }
      throw error
    })
}
