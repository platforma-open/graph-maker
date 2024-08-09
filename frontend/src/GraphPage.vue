<script setup lang="ts">
import '@milaboratory/platforma-uikit/lib/dist/style.css';
import '@milaboratory/graph-maker/dist/style.css';
import { computed, reactive, watch } from 'vue';
import { PColumnIdAndSpec } from '@milaboratory/sdk-ui';
import { useApp } from './app';
import { platforma } from 'block-config';
import { GraphMakerSettings } from '@milaboratory/graph-maker/dist/GraphMaker/types';
import { GraphMaker } from '@milaboratory/graph-maker';

const app = useApp<`/graph?id=${string}`>();

const data = reactive({
  pFrameSpecs: undefined as PColumnIdAndSpec[] | undefined
});

const frameRef = computed(() => app.getOutputFieldOkOptional('pFrame'));

watch(() => frameRef.value, async (frameHandle) => {
  data.pFrameSpecs = undefined;
  if (frameHandle) {
    data.pFrameSpecs = await platforma.pFrameDriver.listColumns(frameHandle);
  }
}, { immediate: true });

function createDefaultSettings():GraphMakerSettings {
  return {
    chartType: 'discrete',
    optionsState: null,
    statisticsSettings: null,
    axesSettings: null,
    layersSettings: null,
    template: null,
    dataBindAes: null,
    labelsModifier: (id) => id,
  }
}

const settings = computed<GraphMakerSettings | null>(() => {
  const saved = app.ui.graphs.find(it => it.id === app.queryParams.id)?.settings;
  if (!saved) {
    console.log(app.ui.graphs, app.queryParams.id)
    return null;
  }
  return {
    ...createDefaultSettings(),
    ...saved,
  } as GraphMakerSettings;
});

watch(() => settings.value, (v) => {
  console.log('watch', v)
}, {immediate: true});

const updateSettings = (nextSettings: GraphMakerSettings) => {
  console.log(nextSettings, 'next settings');
  app.updateUiState(ui => {
    ui.graphs = ui.graphs.map((item) => {
      if (item.id !== app.queryParams.id) {
        return item;
      }
      return {
        ...item,
        settings: {
          ...(item.settings as Partial<GraphMakerSettings>),
          optionsState: nextSettings.optionsState
        }
      }
    });
    return ui;
  });
}

const removeSection = async () => {
  await app.updateUiState(ui => {
    if (!ui) {
      ui = {
        graphs: []
      };
    }
    ui.graphs = ui.graphs.filter(it => it.id !== app.queryParams.id);
    return ui;
  });
  const lastId = app.ui.graphs.length ? app.ui.graphs[app.ui.graphs.length - 1]['id'] : undefined;
  if (lastId) {
    console.log(`navigate to /graph?id=${lastId}`)
    app.navigateTo(`/graph?id=${lastId}`);
  } else {
    console.log('navigate to root')
    // @ts-ignore
    app.navigateTo('/');
  }
};


</script>

<template>
  <div class="container" :key="app.queryParams.id">
    <button @click="removeSection">delete this section</button>
    <graph-maker
      v-if="platforma.pFrameDriver && frameRef && settings"
      :settings="settings as GraphMakerSettings"
      :p-frame-handle="frameRef"
      :p-frame-driver="platforma.pFrameDriver"
      @settings-update="updateSettings"
    />


  </div>
  <fieldset>
    <legend>Frame Specs</legend>
    <pre>{{ data.pFrameSpecs }}</pre>
  </fieldset>
</template>

<style lang="css">
.alert-error {
  background-color: red;
  color: #fff;
  padding: 12px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 1080px;
}

fieldset {
  max-height: 300px;
  max-width: 100%;
  overflow: auto;
}
</style>
