import type { XModule } from '../x-modules.types'
import type { HistoryQueriesXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/x-plugin'
import { historyQueriesEmitters } from './store/emitters'
import { historyQueriesXStoreModule } from './store/module'
import { historyQueriesWiring } from './wiring'

/**
 * HistoryQueries {@link XModule} alias.
 *
 * @public
 */
export type HistoryQueriesXModule = XModule<HistoryQueriesXStoreModule>

/**
 * HistoryQueries {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `history-queries` entry point.
 *
 * @public
 */
export const historyQueriesXModule: HistoryQueriesXModule = {
  name: 'historyQueries',
  storeModule: historyQueriesXStoreModule,
  storeEmitters: historyQueriesEmitters,
  wiring: historyQueriesWiring,
}

XPlugin.registerXModule(historyQueriesXModule)
