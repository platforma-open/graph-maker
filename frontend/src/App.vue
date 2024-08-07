<script setup lang="ts">
import '@milaboratory/platforma-uikit/dist/style.css';
import '@milaboratory/graph-maker/dist/style.css';
import { computed, reactive, watch } from 'vue';
import { PColumnIdAndSpec } from '@milaboratory/sdk-ui';
import { BlockApp } from './app';
import { platforma } from 'block-config';
import { GraphMakerSettings } from '@milaboratory/graph-maker/dist/GraphMaker/types';
import { GraphMaker } from '@milaboratory/graph-maker';
import {AddGraph} from '@milaboratory/platforma-uikit';

const app = BlockApp.use();

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

const settings = reactive<Partial<GraphMakerSettings>>({
  optionsState: null,
  statisticsSettings: null,
  axesSettings: null,
  layersSettings: null,
  template: null,
  dataBindAes: null,
  labelsModifier: (v) => v
});

function onSettingsUpdate(nextSettings: GraphMakerSettings) {
  console.log(nextSettings, 'next settings');
  settings.optionsState = nextSettings.optionsState;
  settings.statisticsSettings = nextSettings.statisticsSettings;
  settings.axesSettings = nextSettings.axesSettings;
  settings.template = nextSettings.template;
  settings.dataBindAes = nextSettings.dataBindAes;
}

const CHART_TYPES = [{group: 'Charts', items: [
    {image: 'discrete', title: 'Discrete', id: 'discrete'},
    {image: 'scatterplot', title: 'Scatter Plot', id: 'scatterplot'},
    {image: 'heatmap', title: 'Heatmap', id: 'heatmap'}
  ]}]
</script>

<template>
  <div class="container">
    <graph-maker
      v-if="platforma.pFrameDriver && frameRef && settings.chartType"
      :key="settings.chartType"
      :settings="settings as GraphMakerSettings"
      :p-frame-handle="frameRef"
      :p-frame-driver="platforma.pFrameDriver"
      @settings-update="onSettingsUpdate"
    />
    <add-graph
      v-if="!settings.chartType"
      @selected="(v) => settings.chartType = v as GraphMakerSettings['chartType']"
      :items="CHART_TYPES"
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
