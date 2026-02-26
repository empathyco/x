/* eslint-disable perfectionist/sort-imports */
// It must be the first, it setups the global cssInjector used by the styles injection system
import './utils/css-injector/css-injector'
import type { SnippetConfig } from './x-installer'
// eslint-disable-next-line import/no-named-default
import { default as AppComponent } from './App.vue'
import { setupDevtools } from './plugins/devtools/devtools.plugin'
import router from './router'
import { createXRoot } from './utils/create-x-root'
import { baseInstallXOptions, baseSnippetConfig } from './views/base-config'
import { XInstaller } from './x-installer/x-installer/x-installer'
import { FilterEntityFactory } from './x-modules/facets/entities/filter-entity.factory'
import { SingleSelectModifier } from './x-modules/facets/entities/single-select.modifier'
import { StickyModifier } from './x-modules/facets/entities/sticky.modifier'
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

const snippetConfig = retrieveSnippetConfig()

const installer = new XInstaller({
  ...baseInstallXOptions,
  rootComponent: AppComponent,
  domElement: createXRoot(snippetConfig),
  onCreateApp: initDevtools,
  installExtraPlugins({ app }) {
    app.use(router)
  },
})

void installer.init(snippetConfig)

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
/**
 * Tries to retrieve the snippet config from the window.initX function or object.
 */
function retrieveSnippetConfig(): SnippetConfig {
  if (typeof window.initX === 'function') {
    return window.initX()
  }
  if (typeof window.initX === 'object') {
    return window.initX
  }
  return baseSnippetConfig
}

/* eslint-enable ts/no-unsafe-argument */
