<script setup lang="ts">
import { useApp } from './app';
import { GraphMakerSettings } from '@milaboratories/graph-maker/dist/GraphMaker/types';
import  AddGraph from './components/AddGraph.vue';
import { PlBlockPage, PlTextField } from '@milaboratories/uikit';
import { CHART_TYPES, getChartTypeByTemplate } from './constants.ts';
import { computed, ref } from 'vue';
import { UiState } from '@platforma-open/milaboratories.graph-maker.model';

const app = useApp();

const newId = computed(() => {
  if (app.ui && app.ui.graphs.length) {
    return String(Math.max(...app.ui.graphs.map(g => Number(g.id))) + 1);
  }
  return '1';
});
const graphTitle = ref<string>('My graph ' + newId.value);

const addSection = async (chartType: GraphMakerSettings['chartType'], template: GraphMakerSettings['template']) => {
  const id = newId.value;
  await app.updateUiState((ui: UiState) => {
    if (!ui) {
      ui = { graphs: [] } as UiState;
    }
    ui.graphs = [...ui.graphs, { id, label: graphTitle.value, settings: { chartType, template } }];
    return ui;
  });
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
  <pl-block-page>
    <div class="container_main_page">
      <pl-text-field label="Graph title" v-model="graphTitle" style="width: 300px;" />
      <add-graph
        @selected="(v) => onSelect(v as GraphMakerSettings['template'])"
        :items="CHART_TYPES"
      />
    </div>
  </pl-block-page>
</template>

<style lang="css">
.container_main_page {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
  align-items: center;
}
</style>
