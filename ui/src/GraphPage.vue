<script setup lang="ts">
import { computed } from 'vue';
import { useApp } from './app';
import { platforma } from '@platforma-open/milaboratories.graph-maker.model';
import { GraphMakerSettings, GraphMaker } from '@milaboratories/graph-maker';

const app = useApp<`/graph?id=${string}`>();

const ui = app.createUiModel(undefined, () => ({ graphs: [] }));

const settings = computed({
  get() {
    const graphState = ui.model.graphs.find(it => it.id === app.queryParams.id);
    if (!graphState) {
      console.error(`Missed saved settings for ${app.queryParams.id}, graphs:`, ui.model.graphs);
      return null;
    }
    return {
      ...(graphState.settings as GraphMakerSettings),
      allowDeleting: true,
      title: graphState.label
    } as GraphMakerSettings;
  },
  set(nextSettings: GraphMakerSettings) {
    ui.model.graphs = ui.model.graphs.map((item) => {
      return item.id === app.queryParams.id ? {
        id: item.id,
        settings: nextSettings,
        label: nextSettings.title
      } : item;
    });
  }
});

const removeSection = async () => {
  await app.updateUiState(ui => {
    ui.graphs = ui.graphs.filter(it => it.id !== app.queryParams.id);
    return ui;
  });
  const lastId = ui.model.graphs.length ? ui.model.graphs[ui.model.graphs.length - 1]['id'] : undefined;
  if (lastId) {
    app.navigateTo(`/graph?id=${lastId}`);
  } else {
    // @ts-ignore
    app.navigateTo('/');
  }
};

</script>

<template>
  <div class="container_graph_page" :key="app.queryParams.id">
    <graph-maker
      v-if="settings"
      v-model="settings"
      :pFrame="app.model.outputs.pFrame"
      :driver="platforma.pFrameDriver"
      @delete-this-graph="removeSection"
    />
  </div>
</template>

<style lang="css">
.container_graph_page {
  min-width: 900px;
  height: 1080px;
  overflow: hidden;
}
</style>
