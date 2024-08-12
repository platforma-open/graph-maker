<script setup lang="ts">
import { useApp } from './app';
import { GraphMakerSettings } from '@milaboratory/graph-maker/dist/GraphMaker/types';
import { AddGraph, TextField } from '@milaboratory/platforma-uikit';
import { CHART_TYPES, getChartTypeByTemplate } from './constants.ts';
import { computed, ref } from 'vue';

const app = useApp();

const newId = computed(() => app.ui ? String(app.ui.graphs.length + 1) : '1');
const graphTitle = ref<string>('My graph ' + newId.value);

const addSection = async (chartType: GraphMakerSettings['chartType'], template: GraphMakerSettings['template']) => {
  const id = newId.value;
  await app.updateUiState(ui => {
    if (!ui) {
      ui = {
        graphs: []
      };
    }
    ui.graphs = [...ui.graphs, {id, label: graphTitle.value, settings: {chartType, template}}];
    return ui;
  });
  console.log(app.ui, 'after update')
  await app.navigateTo(`/graph?id=${id}`);
};

function onSelect(v: GraphMakerSettings['template']) {
  if (!v) {
    return;
  }
  addSection(getChartTypeByTemplate(v), v);
}
</script>

<template>
  <div class="container">
    <text-field label="Graph title" v-model="graphTitle" />
    <add-graph
      @selected="(v) => onSelect(v as GraphMakerSettings['template'])"
      :items="CHART_TYPES"
    />
  </div>
</template>

<style lang="css">
button {
  padding: 12px 0;
}

.container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  gap: 24px;
}
</style>
