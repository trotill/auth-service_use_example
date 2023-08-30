<template>
  <div class="page">
    <q-card class="main q-pa-md">
      <q-card-section class="q-pa-none q-pt-md">
        <q-form @submit="onSubmit" class="column q-gutter-md">
          <q-input v-model="login" label="Логин" outlined dense />
          <q-input
            v-model="password"
            label="Пароль"
            outlined
            dense
            type="password"
          />
          <q-card-actions class="q-pa-none q-pb-md">
            <q-btn
              class="full-width"
              color="primary"
              label="Войти"
              type="submit"
              no-caps
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getPassword } from 'src/utils/hasher'
import { useAuth } from 'src/composables/useAuth'
const { postLogin } = useAuth()
const onSubmit = async () => {
  console.log('submit')
  const hashedPwd = getPassword(login.value, password.value)
  await postLogin(login.value, hashedPwd)
}
const login = ref('')
const password = ref('')
</script>

<style scoped>
.main {
  width: 250px;
}
.page {
  display: flex;
  width: 100%;
  position: absolute;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
