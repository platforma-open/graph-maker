import { createApp } from 'vue';
import { sdkPlugin } from './app';
import '@milaboratory/platforma-uikit/styles';
import '@milaboratory/sdk-vue/lib/dist/style.css'; // @todo (will also be sdk-vue/styles)
import { BlockLayout } from '@milaboratory/sdk-vue';

createApp(BlockLayout).use(sdkPlugin).mount('#app');