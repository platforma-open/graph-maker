<script setup lang="ts">
import '../assets/add-graph.scss';
import AddGraphItem from './AddGraphItem.vue';
import { CHART_TYPES } from '../constants.ts';
import { computed, ref } from 'vue';
import { PlSearchField } from '@platforma-sdk/ui-vue';

defineEmits(['selected']);

const searchModel = ref();

const items = computed(() => {
  const searchValue = searchModel.value?.toLowerCase() ?? '';
  return CHART_TYPES.filter((it) => {
    const title = it.title?.toLowerCase();
    return title?.includes(searchValue);
  });
});
</script>
<template>
  <div class="add-graph-search">
    <PlSearchField v-model="searchModel" placeholder="Find..." clearable />
  </div>
  <div class="add-graph-section">
    <div class="add-graph">
      <AddGraphItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @selected="(v) => $emit('selected', v)"
      />
    </div>
  </div>
</template>
