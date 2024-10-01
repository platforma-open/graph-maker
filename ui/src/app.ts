import { platforma } from '@platforma-open/milaboratories.block-beta-graph-maker.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import MainPage from './MainPage.vue';
import GraphPage from './GraphPage.vue';


export const sdkPlugin = defineApp(platforma, () => {
  return {
    routes: {
      '/': MainPage,
      '/graph': GraphPage
    }
  };
});

export const useApp = sdkPlugin.useApp;