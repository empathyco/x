import Vue from 'vue';
import App from './App.vue';
import { setupDevtools } from './plugins/devtools/devtools.plugin';
import router from './router';
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config';
import { XInstaller } from './x-installer/x-installer/x-installer';
import { FilterEntityFactory } from './x-modules/facets/entities/filter-entity.factory';
import { SingleSelectModifier } from './x-modules/facets/entities/single-select.modifier';
import './tailwind/index.css';

Vue.config.productionTip = false;
FilterEntityFactory.instance.registerModifierByFacetId('age_facet', SingleSelectModifier);
FilterEntityFactory.instance.registerModifierByFilterModelName(
  'HierarchicalFilter',
  SingleSelectModifier
);

const installer = new XInstaller({
  ...baseInstallXOptions,
  app: App,
  vueOptions: {
    router
  },
  domElement: '#app',
  onCreateApp: initDevtools
});

if (window.initX) {
  installer.init();
} else {
  installer.init(baseSnippetConfig);
}

/**
 * If an app is provided, initialise the devtools.
 *
 * @param app - The root Vue instance of the application.
 */
function initDevtools(app: Vue): void {
  if (process.env.NODE_ENV !== 'production') {
    setupDevtools(app);
  }
}
