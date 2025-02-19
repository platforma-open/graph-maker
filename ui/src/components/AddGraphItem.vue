<script setup lang="ts">
import '../assets/add-graph.scss';
import type { GraphCardItem } from '../constants';
//@ts-ignore
import Contour from '../assets/icons/style_White Stroke.svg?raw';

defineProps<{ item: GraphCardItem }>();

defineEmits<{
  (e: 'selected', id: string): void;
}>();
</script>
<template>
  <div class="add-graph__item gap-8" @click="$emit('selected', item.id)">
    <div class="add-graph__text d-flex flex-column gap-6">
      <div class="add-graph__title">{{ item.title }}</div>
      <div class="add-graph__description">{{ item.description }}</div>
    </div>
    <div class="add-graph__icon">
      <div v-html="Contour" class="add-graph__icon-hover" />
      <img :src="item.image" class="add-graph__icon-main" />
    </div>
  </div>
</template>
