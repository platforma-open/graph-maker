import { platforma } from '@platforma-open/milaboratories.graph-maker.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import GraphPage from './GraphPage.vue';
import MainPage from './MainPage.vue';


export const sdkPlugin = defineApp(platforma, () => {
  return {
    routes: {
      '/': () => MainPage,
      '/graph': () => GraphPage
    }
  };
});

export const useApp = sdkPlugin.useApp;