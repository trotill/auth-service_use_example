<template>
<q-layout view="lHh Lpr lFf" container style="height: 100vh" class="shadow-2 rounded-borders">
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title>
        Auth demo
      </q-toolbar-title>
      <q-btn flat dense icon-right="logout" :label="sourceUser" @click="logoutClick"/>
    </q-toolbar>
  </q-header>

  <q-page-container>
    <q-page>
      <q-table
        flat
        title="Accounts"
        row-key="login"
        :rows="users"
        :rows-per-page-options="ROWS_PER_PAGE_OPTIONS_DEFAULT"
        :columns="columns"
        v-model:pagination="tablePagination"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-space/>
          <q-btn
            dense
            round
            icon="add"
            class="q-ml-md"
            @click="addNewUserClick"
          />
        </template>
        <template v-slot:body-cell-updatedAt="props">
          <q-td :props="props">
            {{ new Date(props.row.updatedAt) }}
          </q-td>
        </template>
        <template v-slot:body-cell-locked="props">
          <q-td :props="props">
            <q-icon :name="getLockIcon(props.row.locked)" size="sm"/>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              dense
              icon="edit"
              flat
              class="q-ml-md"
              @click="editUserClick(props.row)"
            />
            <q-btn
              dense
              icon="delete"
              flat
              class="q-ml-md"
              @click="removeUserClick(props.row.login)"
            />
          </q-td>
        </template>
      </q-table>
    </q-page>
  </q-page-container>
</q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { logout, useAuth } from 'src/composables/useAuth'
import { useTable } from 'src/composables/useTable'
import { QTableProps, useQuasar } from 'quasar'
import { UserCreate, UserItem, UsersControllerGetAllOrderEnum } from 'src/api/auth'
import UserDialog from 'components/UserDialog.vue'
import { useRouter } from 'vue-router'
import { ROWS_PER_PAGE_OPTIONS_DEFAULT, SORT_BY_OPTIONS_DEFAULT } from 'src/utils/const'

const router = useRouter()
const { fetchUsers, users, count, createUser, deleteUser, updateUser, whoAmi } = useAuth()
const { limit, offset, tablePagination } = useTable({
  sortByDef: SORT_BY_OPTIONS_DEFAULT,
  rowsPerPageDef: ROWS_PER_PAGE_OPTIONS_DEFAULT[0],
  descendingDef: false,
  totalCount: count
})
const $q = useQuasar()
const sourceUser = ref('')
const columns = [
  { name: 'login', align: 'center', label: 'Login', field: 'login', sortable: true },
  { name: 'firstName', align: 'center', label: 'First name', field: 'firstName', sortable: true },
  { name: 'lastName', align: 'center', label: 'Last name', field: 'lastName', sortable: true },
  { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
  { name: 'updatedAt', align: 'center', label: 'Update time', field: 'updatedAt', sortable: true },
  { name: 'locked', align: 'center', label: 'Lock status', field: 'locked', sortable: true },
  { name: 'role', align: 'center', label: 'Role', field: 'role', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'action' }
]

const onRequest: QTableProps['onRequest'] = async function ({
  pagination: { page, rowsPerPage, sortBy, descending }
}) {
  tablePagination.value!.page = page ?? 1
  tablePagination.value!.rowsPerPage = rowsPerPage ?? ROWS_PER_PAGE_OPTIONS_DEFAULT
  tablePagination.value!.sortBy = sortBy
  tablePagination.value!.descending = !!sortBy && descending
  getUsers()
}

function addNewUserClick () {
  $q.dialog({
    component: UserDialog
  }).onOk(async (result: UserCreate) => {
    await createUser(result)
    getUsers()
  })
}

function editUserClick (userParam: UserItem) {
  $q.dialog({
    component: UserDialog,
    componentProps: { edit: true, userParam }
  }).onOk(async (result) => {
    const { login, ...other } = result
    await updateUser(login, other)
    getUsers()
  })
}

async function removeUserClick (login: string) {
  await deleteUser(login)
  getUsers()
}

async function logoutClick () {
  logout(router)
}

function getLockIcon (lock: boolean) {
  return lock ? 'lock' : 'lock_open'
}

function getUsers () {
  fetchUsers({
    limit: limit.value,
    offset: offset.value,
    sort: tablePagination.value?.sortBy ?? undefined,
    order: tablePagination.value?.descending ? UsersControllerGetAllOrderEnum.Desc : UsersControllerGetAllOrderEnum.Asc
  })
}

onMounted(() => {
  whoAmi().then((ami: UserItem) => {
    sourceUser.value = `User: ${ami.login}, Role: ${ami.role}`
  })
  getUsers()
})
</script>
