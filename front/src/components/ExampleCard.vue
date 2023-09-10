<template>
<q-card
  class="main"
>
  <q-card-section>
    <div class="text-h6">{{ title }}</div>
    <div>{{ subtitle }}</div>
  </q-card-section>

  <q-card-section class="q-pt-none">
    <slot/>
  </q-card-section>
</q-card>
</template>
<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>()
</script>
<style scoped>
.main {
  width: 100%;
  max-width: 350px;
}
</style>
