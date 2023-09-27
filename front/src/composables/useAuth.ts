import { ref } from 'vue'
import { Router, useRouter } from 'vue-router'
import { authApi, axiosLoginInstance } from 'src/api/api'
import { JWTRefresh, UserCreate, UserItem, UsersControllerGetAllOrderEnum, UserUpdate } from 'src/api/auth'
import axios from 'axios'
import { REFRESH_TOKEN_STORE_NAME } from 'src/utils/const'
import { useAbortController } from 'src/composables/abortController'
import { useQuasar } from 'quasar'
import { showError } from 'src/utils/error'

export function useAuth () {
  const users = ref<Array<UserItem>>([])
  const count = ref(0)
  const router = useRouter()
  const abort = useAbortController()
  const $q = useQuasar()
  const postLogin = async (login: string, password: string) => {
    const sessionId = `${Date.now()}_${Math.trunc(Math.random() * 1000)}`
    try {
      const token = await authApi.authControllerLogin({ password, login, sessionId })

      window.localStorage.setItem('refreshToken', token.data.refreshToken)
      await router.push('/')
    } catch (e) {
      showError($q, e)
    }
  }
  const createUser = async (userCreate: UserCreate) => {
    return authApi.usersControllerCreate(userCreate).catch((e) => showError($q, e))
  }
  const updateUser = async (login: string, userUpdate: UserUpdate) => {
    return authApi.usersControllerUpdate(login, userUpdate).catch((e) => showError($q, e))
  }
  const deleteUser = async (login: string) => {
    return authApi.usersControllerDelete(login).catch((e) => showError($q, e))
  }
  const whoAmi = async (): Promise<UserItem> => {
    const response = await authApi.authControllerWhoAmi()
    return response.data
  }
  const fetchUsersWithAbort = (param: object) => {
    return abort(fetchUsers, { ...param })
  }
  const fetchUsers = async ({
    limit = 100,
    offset = 0,
    sort = 'firstName',
    order = UsersControllerGetAllOrderEnum.Asc,
    search = undefined,
    options = {}
  }) => {
    const response = await authApi.usersControllerGetAll(limit, offset, sort, order, search, options)
    users.value = response.data.items
    count.value = response.data.count
  }
  return {
    fetchUsers: fetchUsersWithAbort,
    postLogin,
    users,
    count,
    createUser,
    deleteUser,
    updateUser,
    whoAmi
  }
}

export function logout (router: Router) {
  window.localStorage.removeItem('refreshToken')
  router.push('/login')
}

export function addInterceptors () {
  const router = useRouter()
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
        logout(router)

        throw error
      } else if (error?.response?.status === 401 && !config?.sent) {
        config.sent = true

        const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORE_NAME)

        if (!refreshToken) {
          logout(router)
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
          logout(router)
        }

        return axios(config)
      }
      throw error
    })
}
