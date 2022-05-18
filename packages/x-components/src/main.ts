import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config';
import { XInstaller } from './x-installer/x-installer/x-installer';
import { FilterEntityFactory } from './x-modules/facets/entities/filter-entity.factory';
import { SingleSelectModifier } from './x-modules/facets/entities/single-select.modifier';

Vue.config.productionTip = false;
['hierarchical_category', 'categories_facet', 'brand_facet', 'age_facet'].forEach(facetId =>
  FilterEntityFactory.instance.registerFilterModifier(facetId, [SingleSelectModifier])
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
  installer.init();
} else {
  installer.init(baseSnippetConfig);
}
