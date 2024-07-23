import type { App } from 'vue';
import { default as AppComponent } from './App.vue';
import { setupDevtools } from './plugins/devtools/devtools.plugin';
import router from './router';
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config';
import { XInstaller } from './x-installer/x-installer/x-installer';
import { FilterEntityFactory } from './x-modules/facets/entities/filter-entity.factory';
import { SingleSelectModifier } from './x-modules/facets/entities/single-select.modifier';
import { StickyModifier } from './x-modules/facets/entities/sticky.modifier';
import './tailwind/index.css';

FilterEntityFactory.instance.registerModifierByFacetId('age_facet', SingleSelectModifier);
FilterEntityFactory.instance.registerModifierByFacetId(
  'brand_facet',
  StickyModifier,
  SingleSelectModifier
);
FilterEntityFactory.instance.registerModifierByFacetId('price', SingleSelectModifier);
FilterEntityFactory.instance.registerModifierByFilterModelName(
  'HierarchicalFilter',
  SingleSelectModifier
);

const installer = new XInstaller({
  ...baseInstallXOptions,
  rootComponent: AppComponent,
  domElement: '#app',
  onCreateApp: initDevtools,
  installExtraPlugins({ app }) {
    app.use(router);
  }
});

if (window.initX) {
  installer.init();
} else {
  installer.init(baseSnippetConfig);
}

/**
 * If an app is provided, initialise the devtools.
 *
 * @param app - The Vue application instance of the application.
 */
function initDevtools(app: App): void {
  if (process.env.NODE_ENV !== 'production') {
    setupDevtools(app);
  }
}
