<template>
<router-view/>
</template>

<script setup lang="ts">
import { addInterceptors } from 'src/api/interceptors'

addInterceptors()
</script>
