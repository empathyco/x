import Vue from 'vue';
import App from './App.vue';
import { setupDevtools } from './plugins/devtools/devtools.plugin';
import router from './router';
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config';
import { InitWrapper } from './x-installer/index';
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
  domElement: '#app'
});

if (window.initX) {
  installer.init().then(initDevtools);
} else {
  installer.init(baseSnippetConfig).then(initDevtools);
}

/**
 * If an app is provided, initialise the devtools.
 *
 * @param initWrapper - An object containing the app instance.
 */
function initDevtools(initWrapper: InitWrapper | void): void {
  if (initWrapper?.app && process.env.NODE_ENV !== 'production') {
    setupDevtools(initWrapper.app);
  }
}
