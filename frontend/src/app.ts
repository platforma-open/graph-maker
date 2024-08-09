import { platforma } from 'block-config';
import { defineApp } from '@milaboratory/sdk-vue';
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
