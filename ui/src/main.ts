import { createApp } from 'vue';
import { sdkPlugin } from './app';
import '@milaboratories/uikit/dist/style.css';
import '@milaboratory/graph-maker/dist/style.css';
import '@platforma-sdk/ui-vue/dist/style.css';
import { BlockLayout } from '@platforma-sdk/ui-vue';

createApp(BlockLayout).use(sdkPlugin).mount('#app');