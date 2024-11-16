<script setup lang="ts">
import { useApp } from './app';
import { GraphMakerSettings } from '@milaboratories/graph-maker';
import { PlBlockPage } from '@platforma-sdk/ui-vue';
import { getChartTypeByTemplate } from './constants.ts';
import { computed, ref } from 'vue';
import { UiState } from '@platforma-open/milaboratories.graph-maker.model';
import EditIcon from './assets/edit.vue';
import AddGraph from './components/AddGraph.vue';

const app = useApp();

const newId = computed(() => {
  if (app.ui && app.ui.graphs.length) {
    return String(Math.max(...app.ui.graphs.map(g => Number(g.id))) + 1);
  }
  return '1';
});
const graphTitle = ref<string>('');

const addSection = async (chartType: GraphMakerSettings['chartType'], template: GraphMakerSettings['template']) => {
  const id = newId.value;
  const defaultTitle = 'My graph ' + id;
  const label = graphTitle.value || defaultTitle;
  await app.updateUiState((ui: UiState) => {
    if (!ui) {
      ui = { graphs: [] } as UiState;
    }
    ui.graphs = [...ui.graphs, { id, label, settings: { chartType, template } }];
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

function onTitleChange(e: Event) {
  const target = e.currentTarget as HTMLInputElement;
  graphTitle.value = target.value;
}
</script>

<template>
  <pl-block-page>
    <div class="container_main_page">
      <div class="chart_header" :class="{empty: !graphTitle}">
        <input
          class="chart_title"
          :value="graphTitle"
          placeholder="New graph"
          @change="onTitleChange"
          @keyup.enter="(e) => {(e.target as HTMLInputElement)?.blur()}"
        />
        <component class="chart_edit" :is="EditIcon" />
      </div>
      <add-graph @selected="(v) => onSelect(v as GraphMakerSettings['template'])"/>
    </div>
  </pl-block-page>
</template>

<style lang="css">
.container_main_page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: max-content;
  overflow: hidden;
  gap: 16px;
  align-items: center;
}

.chart_header {
  display: flex;
  margin-bottom: 16px;
  width: 100%;
}

.chart_edit {
  margin-top: 11px;
  margin-left: -24px;
  opacity: 0;
  pointer-events: none;
}

.chart_header:hover .chart_edit,
.chart_header.empty .chart_edit,
.chart_header:focus-within .chart_edit {
  opacity: 1;
}

.chart_title {
  font-family: var(--font-family-base);
  font-weight: var(--font-weigh-base);

  font-size: 28px;
  height: 40px;
  border: none;
  outline: none;
  text-overflow: ellipsis;
  margin-left: -2px;
  padding-right: 28px;
  cursor: pointer;
  field-sizing: content;
}

.chart_title::placeholder {
  color: var(--dis-01);
}
</style>
