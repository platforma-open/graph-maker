import { platforma } from "@platforma-open/milaboratories.graph-maker.model";
import { defineAppV3 } from "@platforma-sdk/ui-vue";
import GraphPage from "./GraphPage.vue";
import MainPage from "./MainPage.vue";

export const sdkPlugin = defineAppV3(platforma, () => {
  return {
    routes: {
      "/": () => MainPage,
      "/graph": () => GraphPage,
    },
  };
});

export const useApp = sdkPlugin.useApp;
