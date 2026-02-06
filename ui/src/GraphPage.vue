<script setup lang="ts">
import { computed } from 'vue';
import { useApp } from './app';
import { GraphMakerState, GraphMaker } from '@milaboratories/graph-maker';
import { GraphPageState } from '@platforma-open/milaboratories.graph-maker.model';

const app = useApp<`/graph?id=${string}`>();

const graphProps = computed(() => app.model.ui.graphs.find(it => it.id === app.queryParams.id)?.settings)
const state = computed({
  get() {
    const graphState = app.model.ui.graphs.find(it => it.id === app.queryParams.id);
    if (!graphState) {
      return null;
    }
    return {
      ...(graphState.state as GraphMakerState),
      title: graphState.label
    } as GraphMakerState;
  },
  set(nextState: GraphMakerState) {
    app.model.ui.graphs = app.model.ui.graphs.map((item) => {
      return item.id === app.queryParams.id ? {
        id: item.id,
        label: nextState.title,
        state: nextState,
        settings: graphProps.value,
      } as GraphPageState : item;
    });
  }
});

const removeSection = async () => {
  const deletedId = app.queryParams.id;
  let lastId;
  for (const graph of app.model.ui.graphs) {
    if (graph.id !== app.queryParams.id) {
      lastId = graph.id;
    }
  }

  app.model.ui.graphs = app.model.ui.graphs.filter(it => it.id !== deletedId);
  // @ts-ignore
  await app.navigateTo(lastId ? `/graph?id=${lastId}` : '/');
};
</script>

<template>
  <div class="container_graph_page" :key="app.queryParams.id">
    <graph-maker
      v-if="state && graphProps"
      v-model="state"
      :pFrame="app.model.outputs.pFrame"
      :chartType="graphProps.chartType"
      :allowChartDeleting="true"
      :allowTitleEditing="true"
      :dataColumnPredicate="() => true"
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
