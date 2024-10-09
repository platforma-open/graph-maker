<script setup lang="ts">
import '../assets/add-graph.scss';
import AddGraphItem from './AddGraphItem.vue';
import { CHART_TYPES } from '../constants.ts';

defineEmits(['selected']);

</script>
<template>
  <div class="add-graph">
    <template v-for="(groupItem, idx) in CHART_TYPES" :key="idx">
      <AddGraphItem
        v-for="(item, index) in groupItem.items"
        :key="index"
        :item="item"
        :group="groupItem.group"
        @selected="(v) => $emit('selected', v)"
      />
    </template>
  </div>
</template>
