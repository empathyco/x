import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import { setupDevtools } from './plugins/devtools/devtools.plugin';
import router from './router';
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config';
import { XInstaller } from './x-installer/x-installer/x-installer';

Vue.config.productionTip = false;
new XInstaller({
  ...baseInstallXOptions,
  app: App,
  vueOptions: {
    router
  },
  domElement: '#app'
})
  .init(baseSnippetConfig)
  .then(({ app }) => {
    setupDevtools(app!);
  });
