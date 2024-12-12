<script setup lang="ts">
import '../assets/add-graph.scss';
import type { GraphCardItem } from '../constants';
//@ts-ignore
import Contour from '../assets/new-assets/style_White Stroke.svg?raw';

defineProps<{ item: GraphCardItem }>();

defineEmits<{
  (e: 'selected', id: string): void;
}>();
</script>
<template>
  <div class="add-graph__item" @click="$emit('selected', item.id)">
    <div class="add-graph__text d-flex flex-column gap-6">
      <div class="add-graph__title">{{ item.title }}</div>
      <div class="add-graph__description text-description">{{ item.description }}</div>
    </div>
    <div class="add-graph__icon">
      <img :src="item.image" class="add-graph__icon-main" />
      <div v-html="Contour" class="add-graph__icon-hover" />
    </div>
  </div>
</template>
