<template>
<example-card title="Example 1"
              subtitle="Everyone can increment, only admin can decrement. Blocking at role guard level">

  <div class="row">
    <q-btn label="increment" @click="increment"/>
    <q-input readonly v-model="incDecValue" dense borderless style="width: 90px; padding-left: 20px"/>
    <q-btn label="decrement" @click="decrement"/>
  </div>
</example-card>
</template>

<script setup lang="ts">

import ExampleCard from 'components/ExampleCard.vue'
import { useExample } from 'src/composables/useExample'

const { decrementReq, incrementReq, incDecValue, getValue } = useExample()

async function increment () {
  await incrementReq()
  await getValue()
}

async function decrement () {
  if (incDecValue.value === 0) return
  await decrementReq()
  await getValue()
}

getValue()
</script>

<style scoped>

</style>
