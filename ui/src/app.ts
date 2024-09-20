import { model } from '@milaboratory/milaboratories.block-beta-graph-maker.model';
import { defineApp } from '@milaboratory/sdk-vue';
import MainPage from './MainPage.vue';
import GraphPage from './GraphPage.vue';


export const sdkPlugin = defineApp(model, () => {
  return {
    routes: {
      '/': MainPage,
      '/graph': GraphPage
    }
  };
});

export const useApp = sdkPlugin.useApp;