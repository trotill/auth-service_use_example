<template>
<div class="row justify-around">
  <example-card title="Example 1"
                subtitle="Everyone can increment, only admin can decrement. Blocking at role guard level">

    <div class="row">
      <q-btn label="increment" @click="increment"/>
      <q-input readonly v-model="incDecValue" dense borderless style="width: 90px; padding-left: 20px"/>
      <q-btn label="decrement" @click="decrement"/>
    </div>
  </example-card>
  <example-card title="Example 2"
                subtitle="Roles below administrator do not have permissions to change all colors. Blocking in the service using information from the access token">

    <div class="row justify-between">
      <q-btn label="change color" @click="changeColor"/>
      <div class="colorBox" :style="{'background-color':randomColor}"/>
    </div>
  </example-card>
</div>
</template>

<script setup lang="ts">

import ExampleCard from 'components/ExampleCard.vue'
import { useExample } from 'src/composables/useExample'

const { decrementReq, incrementReq, incDecValue, getValue, randomColor, getRandomColor } = useExample()

async function increment () {
  await incrementReq()
  await getValue()
}

async function changeColor () {
  return getRandomColor()
}

async function decrement () {
  if (incDecValue.value === 0) return
  await decrementReq()
  await getValue()
}

getValue()
</script>

<style scoped>
.colorBox {
  width: 138px;
}

</style>
