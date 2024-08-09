<script setup lang="ts">
import { useApp } from './app';
import { GraphMakerSettings } from '@milaboratory/graph-maker/dist/GraphMaker/types';
import { AddGraph } from '@milaboratory/platforma-uikit';

const app = useApp();

const addSection = async (chartType: GraphMakerSettings['chartType']) => {
  const id = app.ui ? String(app.ui.graphs.length + 1) : '1';
  await app.updateUiState(ui => {
    if (!ui) {
      ui = {
        graphs: []
      };
    }
    ui.graphs = [...ui.graphs, {id, label: 'My graph ' + id, settings: {chartType}}];
    return ui;
  });
  console.log(app.ui, 'after update')
  await app.navigateTo(`/graph?id=${id}`);
};

const CHART_TYPES = [{
  group: 'Charts', items: [
    { image: 'discrete', title: 'Discrete', id: 'discrete' },
    { image: 'scatterplot', title: 'Scatter Plot', id: 'scatterplot' },
    { image: 'heatmap', title: 'Heatmap', id: 'heatmap' }
  ]
}];

function onSelect(v: GraphMakerSettings['chartType']) {
  console.log(`select ${v}`)
  addSection(v);
}
</script>

<template>
  <div class="container">
    <add-graph
      @selected="(v) => onSelect(v as GraphMakerSettings['chartType'])"
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
