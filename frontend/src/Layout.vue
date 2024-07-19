<script setup lang="ts">
import '@milaboratory/platforma-uikit/dist/style.css';
import '@milaboratory/sdk-vue/lib/dist/style.css';
import { BlockLayout } from '@milaboratory/sdk-vue';
import App from './App.vue';
import { BlockApp } from './app';
</script>

<template>
  <block-layout>
    <div v-if="BlockApp.error" style="color: red">{{ BlockApp.error }}</div>
    <App v-if="BlockApp.loaded" />
    <div v-else>Initial loading...</div>
  </block-layout>
</template>

<style scoped>
#app {
  height: 100%;
}
</style>