import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import { setupDevtools } from './plugins/devtools/devtools.plugin';
import router from './router';
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config';
import { XInstaller } from './x-installer/x-installer/x-installer';
import { FilterEntityFactory } from './x-modules/facets/entities/filter-entity.factory';
import { SingleSelectModifier } from './x-modules/facets/entities/single-select.modifier';

Vue.config.productionTip = false;
['categories_facet', 'brand_facet', 'age_facet'].forEach(facetId =>
  FilterEntityFactory.instance.registerFilterModifier(facetId, [SingleSelectModifier])
);
const xModulesURLConfig = JSON.parse(new URL(location.href).searchParams.get('xModules') ?? '{}');
new XInstaller({
  ...baseInstallXOptions,
  app: App,
  xModules: xModulesURLConfig,
  vueOptions: {
    router
  },
  domElement: '#app'
})
  .init(baseSnippetConfig)
  .then(({ app }) => {
    if (process.env.NODE_ENV !== 'production') {
      setupDevtools(app!);
    }
  });
