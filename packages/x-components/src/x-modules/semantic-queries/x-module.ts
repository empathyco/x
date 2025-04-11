import type { XModule } from '../x-modules.types'
import type { SemanticQueriesXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/x-plugin'
import { semanticQueriesEmitters } from './store/emitters'
import { semanticQueriesXStoreModule } from './store/module'
import { semanticQueriesWiring } from './wiring'

/**
 * SemanticQueries {@link XModule} alias.
 *
 * @public
 */
export type SemanticQueriesXModule = XModule<SemanticQueriesXStoreModule>

/**
 * SemanticQueries {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `semantic-queries`entry point.
 *
 * @public
 */
export const semanticQueriesXModule: SemanticQueriesXModule = {
  name: 'semanticQueries',
  storeModule: semanticQueriesXStoreModule,
  storeEmitters: semanticQueriesEmitters,
  wiring: semanticQueriesWiring,
}

XPlugin.registerXModule(semanticQueriesXModule)
