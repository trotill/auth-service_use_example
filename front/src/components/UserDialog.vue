<template>
<q-dialog persistent ref="dialogRef" @hide="onDialogHide">
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="person" color="white" text-color="gray"/>
      <span class="q-ml-sm">{{ headerText }}</span>
    </q-card-section>
    <q-card-section class="card-section">
      <q-form ref="form" class="q-gutter-md">
        <q-toggle label="locked" outlined dense class="q-pb-md" v-model="param.locked" :true-value="1"
                  :false-value="0"/>
        <q-select label="Select role" v-model="param.role" :options="options" dense outlined/>
        <q-input
          label="login"
          outlined
          dense
          v-model="param.login"
          :rules="rules.login"
          lazy-rules/>
        <q-input label="first name" outlined dense v-model="param.firstName"/>
        <q-input label="last name" outlined dense v-model="param.lastName"/>
        <q-input label="e-mail" outlined dense v-model="param.email" :rules="rules.email"
                 lazy-rules/>
        <q-separator/>
        <q-btn v-if="edit&&!showInputPassword" label="Change password?" color="primary"
               @click="showInputPassword=true"/>
        <q-input v-if="showInputPassword" label="password" outlined dense :type="isPwd ? 'password' : 'text'"
                 v-model="password">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input v-if="showInputPassword" label="copy password" outlined dense :type="isPwd ? 'password' : 'text'"

                 v-model="passwordCopy">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-form>
    </q-card-section>
    <q-card-actions align="between">

      <q-btn label="Close" color="blue-grey" v-close-popup outline class="button"/>
      <q-btn :label="edit?'Save':'Add'" color="primary" class="button" outline @click="saveUser"/>
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script setup lang="ts">
import { UserItem, UserItemRoleEnum } from 'src/api/auth'
import { computed, reactive, ref } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { getPassword } from 'src/utils/hasher'

const props = withDefaults(defineProps<{
  edit: boolean
  userParam?: UserItem | undefined
}>(), {
  edit: false,
  userParam: {
    locked: 1,
    login: undefined,
    role: undefined,
    firstName: undefined,
    lastName: undefined,
    updatedAt: undefined,
    email: undefined,
    createdAt: undefined
  }
})

const $q = useQuasar()
const options = [
  UserItemRoleEnum.Admin,
  UserItemRoleEnum.Guest,
  UserItemRoleEnum.Operator
]
const isPwd = ref(true)

const form = ref()
const rules = {
  login: [
    (val: string) => !!val || '* Required',
    (val: string) => val.length >= 5 || 'Please use minimum 5 characters',
    (val: string) => /[\w.-]{0,19}[0-9a-zA-Z]$/.test(val) || 'Use number and latin symbols'
  ],
  email: [
    (val: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val) || 'Incorrect email'
  ]
}
const password = ref(undefined)
const passwordCopy = ref(undefined)
const headerText = computed(() => {
  return props.edit && props.userParam ? `Edit user ${props.userParam.login}` : 'Add new user'
})

const showInputPassword = ref(!props.edit)
const param = reactive<UserItem>({ ...props.userParam })
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
defineEmits([...useDialogPluginComponent.emits])

async function saveUser () {
  if (!await form.value.validate()) {
    return
  }
  if (password.value !== passwordCopy.value) {
    $q.notify({
      type: 'negative',
      message: 'Passwords is different'
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, updatedAt, ...cleanParam } = param
  const hashedPwd = (password.value) ? getPassword(param.login, password.value) : undefined
  onDialogOK({ ...cleanParam, password: hashedPwd })
}
</script>

<style scoped>
.card-section {
  min-width: 400px;
}

.button {
  width: 100px;
}

</style>
