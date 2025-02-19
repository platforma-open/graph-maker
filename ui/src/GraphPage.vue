<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useApp } from './app';
import { GraphMakerState, GraphMaker } from '@milaboratories/graph-maker';
import { GraphPageState } from '@platforma-open/milaboratories.graph-maker.model';
import {PlDropdown} from '@platforma-sdk/ui-vue';

const app = useApp<`/graph?id=${string}`>();

const ui = app.createUiModel(undefined, () => ({ graphs: [] }));

const graphProps = computed(() => ui.model.graphs.find(it => it.id === app.queryParams.id)?.settings)
const state = computed({
  get() {
    const graphState = ui.model.graphs.find(it => it.id === app.queryParams.id);
    if (!graphState) {
      console.error(`Missed saved settings for ${app.queryParams.id}, graphs:`, ui.model.graphs);
      return null;
    }
    return {
      ...(graphState.state as GraphMakerState),
      title: graphState.label
    } as GraphMakerState;
  },
  set(nextState: GraphMakerState) {
    ui.model.graphs = ui.model.graphs.map((item) => {
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

const dropdownValues = [{value: 'v1', text: 'v1'}, {value: 'v2', text: 'v2'}]
const dropdownSelected = ref('v1');
const keyValue = ref('v1');


watch(() => dropdownSelected.value, () => {
  ui.model.graphs = [{ id: 'id', label: 'test label', state: { template: 'box', title: 'tst', currentTab: null }, settings: { chartType: 'discrete', pFrame: undefined } }]
  keyValue.value = dropdownSelected.value;
})
//
// watch(() => app.model.outputs.pFrame, async (handle) => {
//   const list = await platforma?.pFrameDriver.listColumns(handle!);
//   console.log(list, 'list')
// }, {immediate: true})
</script>

<template>
  <div class="container_graph_page" :key="app.queryParams.id">
    <graph-maker
      :key="keyValue"
      v-if="state && graphProps"
      v-model="state"
      :pFrame="app.model.outputs.pFrame"
      :chartType="graphProps.chartType"
      :allowDeleting="true"
      @delete-this-graph="removeSection"
    >
      <template #titleLineSlot>
        <PlDropdown v-model="dropdownSelected" :options="dropdownValues"
                    label="Test" :style="{ width: '300px' }" />
      </template>
    </graph-maker>
  </div>
</template>

<style lang="css">
.container_graph_page {
  min-width: 900px;
  height: 1080px;
  overflow: hidden;
}
</style>
