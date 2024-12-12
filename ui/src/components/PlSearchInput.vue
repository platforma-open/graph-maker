<script setup lang="ts">
import { PlMaskIcon24, PlIcon16 } from '@platforma-sdk/ui-vue';
const model = defineModel<string>();
defineProps<{ placeholder?: string; clearable?: boolean }>();
</script>
<template>
  <div class="pl-search-input d-flex gap-8 align-center">
    <PlMaskIcon24 name="search" />
    <input
      :value="model"
      :placeholder="placeholder"
      class="text-s flex-grow-1"
      @input="model = ($event.target as HTMLInputElement).value"
    />
    <PlIcon16 v-if="clearable" name="delete-clear" @click="model = ''" />
  </div>
</template>

<style lang="scss">
.pl-search-input {
  height: 40px;
  min-height: 40px;
  border-bottom: 1px solid var(--border-color-default);

  input {
    outline: none;
    border: none;
    caret-color: var(--border-color-focus);
  }

  input::placeholder {
    color: var(--txt-mask);
  }

  &:focus-within {
    border-bottom-color: var(--border-color-focus);
  }
}
</style>
