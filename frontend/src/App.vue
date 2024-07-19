<script setup lang="ts">
import '@milaboratory/platforma-uikit/dist/style.css';
import { computed, reactive, watch } from 'vue';
import { ImportFileHandle, LsEntry, PColumnIdAndSpec, PTableVector, StorageEntry, StorageHandle } from '@milaboratory/sdk-ui';
import { BtnPrimary, SelectInput, TextField } from '@milaboratory/platforma-uikit';
import { z } from 'zod';
import { BlockApp } from './app';
import { platforma } from 'block-config';
import { createModel, FileDialog } from '@milaboratory/sdk-vue';
import type { ImportedFiles } from '@milaboratory/sdk-vue';

const app = BlockApp.use();

const data = reactive({
  modalOpenCsv: false,
  modalOpenParams: false,
  pTableData: undefined as PTableVector[] | undefined,
  pFrameSpecs: undefined as PColumnIdAndSpec[] | undefined
});

const csvFile = createModel({
  get() {
    return app.args.csvFile;
  },
  validate: z.string().transform((s) => s as ImportFileHandle).optional().parse,
  autoSave: true,
  onSave(v) {
    app.updateArgs(args => args.csvFile = v);
  }
});

const paramsFile = createModel({
  get() {
    return app.args.paramsFile;
  },
  validate: z.string().transform((s) => s as ImportFileHandle).optional().parse,
  autoSave: true,
  onSave(v) {
    app.updateArgs(args => args.paramsFile = v);
  }
});

const csvProgress = computed(() => app.getOutputFieldOkOptional('csvProgress'));
const paramsProgress = computed(() => app.getOutputFieldOkOptional('paramsProgress'));

const tableRef = computed(() => app.getOutputFieldOkOptional('pTable'));
const frameRef = computed(() => app.getOutputFieldOkOptional('pFrame'));

watch(() => tableRef.value, async (n) => {
  data.pTableData = undefined;
  console.log("INasdasdasdsd")
  if (n) {
    data.pTableData = await platforma.pFrameDriver.getData(n, [0, 1, 3], { offset: 0, length: 20 });
  }
}, { immediate: true })

watch(() => frameRef.value, async (frameHandle) => {
  data.pTableData = undefined;
  if (frameHandle) {
    data.pFrameSpecs = await platforma.pFrameDriver.listColumns(frameHandle);
  }
}, { immediate: true })

const onImportCsv = (v: ImportedFiles) => {
  if (v.files.length > 0) {
    csvFile.modelValue = v.files[0];
  }
};

const onImportParams = (v: ImportedFiles) => {
  if (v.files.length > 0) {
    paramsFile.modelValue = v.files[0];
  }
};

</script>

<template>
  <div class="container">
    <h3>Import file</h3>
    <!-- 
    <select-input label="Storage" v-model="data.storageHandle"
      :options="data.storageList.map(it => ({ text: it.name, value: it.handle }))" />

    <text-field v-if="data.storageHandle" label="LS Path" v-model="data.lsPath" />

    <select-input label="File to upload" v-model="fileHandle.modelValue" :options="fileOptions" clearable />

    

    <div v-if="data.lsError" class="alert-error">
      Error: {{ data.lsError }}
    </div>
    <fieldset v-else>
      <legend>{{ data.lsPath }}</legend>
      <pre style="overflow: auto; max-height: 300px; max-width: 100%;">{{ data.files }}</pre>
    </fieldset> /Volumes/Data/Projects/MiLaboratory/blocks-beta/block-beta-csv-to-pframe/test/assets/ -->

    <btn-primary @click="data.modalOpenCsv = true">Set CSV file</btn-primary>

    <div>{{ csvFile.modelValue }}</div>

    <div>{{ csvProgress }}</div>

    <btn-primary @click="data.modalOpenParams = true">Set Params file</btn-primary>

    <div>{{ paramsFile.modelValue }}</div>

    <div>{{ paramsProgress }}</div>

    <div>{{ tableRef }}</div>

    <fieldset>
      <legend>Table Data</legend>
      <pre>{{ data.pTableData }}</pre>
    </fieldset>

    <fieldset>
      <legend>Frame Specs</legend>
      <pre>{{ data.pFrameSpecs }}</pre>
    </fieldset>

    <file-dialog v-model="data.modalOpenCsv" @import:files="onImportCsv" />
    <file-dialog v-model="data.modalOpenParams" @import:files="onImportParams" />

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