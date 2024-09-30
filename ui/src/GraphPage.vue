<script setup lang="ts">
import { computed } from 'vue';
import { useApp } from './app';
import { UiState, model } from '@platforma-open/milaboratories.block-beta-graph-maker.model';
import { GraphMakerSettings } from '@milaboratory/graph-maker/dist/GraphMaker/types';
import { GraphMaker } from '@milaboratory/graph-maker';
import {PlBlockPage} from '@milaboratories/uikit';

const app = useApp<`/graph?id=${string}`>();

const frameRef = computed(() => app.getOutputFieldOkOptional('pFrame'));

function createDefaultSettings(): GraphMakerSettings {
  return {
    chartType: 'discrete' as GraphMakerSettings['chartType'],
    optionsState: null,
    statisticsSettings: null,
    axesSettings: null,
    layersSettings: null,
    template: null,
    dataBindAes: null,
    labelsModifier: (id) => id
  };
}

const settings = computed<GraphMakerSettings | null>(() => {
  const saved = app.ui.graphs.find(it => it.id === app.queryParams.id)?.settings;
  if (!saved) {
    console.error(`Missed saved settings for ${app.queryParams.id}, graphs:`, app.ui.graphs);
    return null;
  }
  return {
    ...createDefaultSettings(),
    ...saved
  } as GraphMakerSettings;
});

const updateSettings = (nextSettings: GraphMakerSettings) => {
  app.updateUiState(ui => {
    ui.graphs = ui.graphs.map((item) => {
      if (item.id !== app.queryParams.id) {
        return item;
      }
      return {
        ...item,
        settings: {
          ...item.settings as GraphMakerSettings,
          ...nextSettings
        }
      };
    });
    return ui;
  });
};

const removeSection = async () => {
  await app.updateUiState(ui => {
    if (!ui) {
      ui = { graphs: [] } as UiState;
    }
    ui.graphs = ui.graphs.filter(it => it.id !== app.queryParams.id);
    return ui;
  });
  const lastId = app.ui.graphs.length ? app.ui.graphs[app.ui.graphs.length - 1]['id'] : undefined;
  if (lastId) {
    app.navigateTo(`/graph?id=${lastId}`);
  } else {
    // @ts-ignore
    app.navigateTo('/');
  }
};

const graphTitle = computed(() => {
  const graphState = app.ui.graphs.find((item) => item.id === app.queryParams.id);
  return graphState?.label ?? '';
});

function updateGraphTitle(nextLabel: string) {
  app.updateUiState(ui => {
    if (!ui) {
      ui = { graphs: [] } as UiState;
    }
    ui.graphs = ui.graphs.map((item) => {
      if (item.id !== app.queryParams.id) {
        return item;
      }
      return {
        ...item,
        label: nextLabel
      };
    });
    return ui;
  });
}

</script>

<template>
  <pl-block-page>
  <div class="container_graph_page" :key="app.queryParams.id">
      <graph-maker
        v-if="model.pFrameDriver && frameRef && settings"
        :graph-title="graphTitle"
        :settings="settings as GraphMakerSettings"
        :p-frame-handle="frameRef"
        :p-frame-driver="model.pFrameDriver"
        @settings-update="updateSettings"
        @graph-title-update="updateGraphTitle"
      />
      <button @click="removeSection" class="remove_button_graph_page">delete this section</button>
  </div>
  </pl-block-page>
</template>

<style lang="css">
.container_graph_page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 1080px;
}

.remove_button_graph_page {
  width: 200px;
}
</style>
