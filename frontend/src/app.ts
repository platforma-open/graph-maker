import { BlockArgs, BlockOutputs, platforma } from 'block-config';
import { defineApp } from '@milaboratory/sdk-vue';

export const BlockApp = defineApp<BlockArgs, BlockOutputs>(platforma, () => {
  return {
    routes: {}
  };
});