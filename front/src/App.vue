<template>
  <router-view />
</template>

<script setup lang="ts">
import { addInterceptors, logout } from 'src/composables/useAuth'

addInterceptors()
</script>
