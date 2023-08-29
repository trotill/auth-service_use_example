import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { authApi } from 'src/api/api'
import { UsersControllerGetAllOrderEnum } from 'src/api/auth'

export function getUsers () {
  const $q = useQuasar()
  const data = ref()
  const fetchUsers = async ({
    limit = 100,
    offset = 0,
    sort = 'firstName',
    order = UsersControllerGetAllOrderEnum.Asc,
    search = ''
  }) => {
    const response = await authApi.usersControllerGetAll(limit, offset, sort, order, search)
    data.value = response.data
    console.log('getUsers', response)
  }
  return {
    fetchUsers
  }
}

export function logout () {
  const router = useRouter()
  window.localStorage.removeItem('refreshToken')
  console.log('Доработать логаут')
  router.push('/login')
}
