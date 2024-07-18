import { platformAdapter } from '@empathyco/x-adapter-platform';
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config';
import Vue3 from './vue3.vue';
import { XInstaller } from './x-installer/x-installer/x-installer';

window.initX = baseSnippetConfig;

new XInstaller({
  ...baseInstallXOptions,
  adapter: platformAdapter,
  app: Vue3,
  domElement: '#app'
}).init();
