<template>
  <q-page class="row items-center justify-evenly">
    <q-table
      title="Accounts"
      row-key="name"
    ></q-table>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getUsers } from 'src/composables/useAuth'
const { fetchUsers } = getUsers()
const columns = [
  { name: 'firstName', align: 'center', label: 'First name', field: 'firstName', sortable: true },
  { name: 'lastName', align: 'center', label: 'Last name', field: 'lastName', sortable: true },
  { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
  { name: 'updatedAt', align: 'center', label: 'Update time', field: 'updatedAt', sortable: true },
  { name: 'locked', align: 'center', label: 'Locked', field: 'locked', sortable: true }
]
onMounted(() => {
  fetchUsers({ limit: 100, offset: 0 })
})
</script>
