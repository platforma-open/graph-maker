<script setup lang="ts">
import '@milaboratory/platforma-uikit/dist/style.css';
import { computed, reactive, watch } from 'vue';
import { PColumnIdAndSpec } from '@milaboratory/sdk-ui';
import { BlockApp } from './app';
import { platforma } from 'block-config';

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
}, { immediate: true })

</script>

<template>
  <div class="container">
    <h3>Graphmaker test</h3>

    <fieldset>
      <legend>Frame Specs</legend>
      <pre>{{ data.pFrameSpecs }}</pre>
    </fieldset>

  </div>
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
}

fieldset {
  max-height: 300px;
  max-width: 100%;
  overflow: auto;
}
</style>
