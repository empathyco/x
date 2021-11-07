import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config';
import { XInstaller } from './x-installer/x-installer/x-installer';

Vue.config.productionTip = false;
const xModulesURLConfig = JSON.parse(new URL(location.href).searchParams.get('xModules') ?? '{}');
new XInstaller({
  ...baseInstallXOptions,
  app: App,
  xModules: xModulesURLConfig,
  vueOptions: {
    router
  },
  domElement: '#app'
}).init(baseSnippetConfig);
