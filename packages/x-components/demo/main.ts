import type { App } from 'vue'
import { XInstaller } from '../src/x-installer/x-installer'
import { FilterEntityFactory } from '../src/x-modules/facets/entities/filter-entity.factory'
import { SingleSelectModifier } from '../src/x-modules/facets/entities/single-select.modifier'
import { StickyModifier } from '../src/x-modules/facets/entities/sticky.modifier'
import AppComponent from './app.vue'
import { setupDevtools } from './plugins/devtools/devtools.plugin'
import router from './router'
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config'
import './tailwind/index.css'

/* eslint-disable ts/no-unsafe-argument */
FilterEntityFactory.instance.registerModifierByFacetId('age_facet', SingleSelectModifier as any)
FilterEntityFactory.instance.registerModifierByFacetId(
  'brand_facet',
  StickyModifier as any,
  SingleSelectModifier as any,
)
FilterEntityFactory.instance.registerModifierByFacetId('price', SingleSelectModifier as any)
FilterEntityFactory.instance.registerModifierByFilterModelName(
  'HierarchicalFilter',
  SingleSelectModifier as any,
)

const installer = new XInstaller({
  ...baseInstallXOptions,
  rootComponent: AppComponent,
  domElement: '#app',
  onCreateApp: initDevtools,
  installExtraPlugins({ app }) {
    app.use(router)
  },
})

if (window.initX) {
  void installer.init()
} else {
  void installer.init(baseSnippetConfig)
}

/**
 * If an app is provided, initialise the devtools.
 *
 * @param app - The Vue application instance of the application.
 */
function initDevtools(app: App): void {
  // eslint-disable-next-line node/prefer-global/process
  if (process.env.NODE_ENV !== 'production') {
    setupDevtools(app)
  }
}
/* eslint-enable ts/no-unsafe-argument */
