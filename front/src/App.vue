<template>
<router-view/>
</template>

<script setup lang="ts">
import { addInterceptors } from 'src/composables/useAuth'

addInterceptors()
</script>
