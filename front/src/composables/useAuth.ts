import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi, userApi } from 'src/api/api'
import { UserCreate, UserItem, UsersControllerGetAllOrderEnum, UserUpdate } from 'src/api/auth'
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
      window.localStorage.setItem('sessionId', sessionId)
      await router.push('/')
    } catch (e) {
      showError($q, e)
    }
  }
  const createUser = async (userCreate: UserCreate) => {
    return userApi.usersControllerCreate(userCreate).catch((e) => showError($q, e))
  }
  const updateUser = async (login: string, userUpdate: UserUpdate) => {
    return userApi.usersControllerUpdate(login, userUpdate).catch((e) => showError($q, e))
  }
  const deleteUser = async (login: string) => {
    return userApi.usersControllerDelete(login).catch((e) => showError($q, e))
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
    const response = await userApi.usersControllerGetAll(limit, offset, sort, order, search, options)
    users.value = response.data.items
    count.value = response.data.count
  }

  async function logoutRequest (login: string) {
    const sessionId = window.localStorage.getItem('sessionId') ?? '_'
    return authApi.authControllerLogout({ login, sessionId })
  }

  async function logout () {
    window.localStorage.removeItem('refreshToken')
    window.localStorage.removeItem('sessionId')
    return router.push('/login')
  }

  return {
    fetchUsers: fetchUsersWithAbort,
    postLogin,
    users,
    count,
    createUser,
    deleteUser,
    updateUser,
    whoAmi,
    logout,
    logoutRequest
  }
}
