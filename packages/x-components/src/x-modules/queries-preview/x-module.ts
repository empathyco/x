import type { XModule } from '../x-modules.types'
import type { QueriesPreviewXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/x-plugin'
import { queriesPreviewEmitters } from './store/emitters'
import { queriesPreviewXStoreModule } from './store/module'
import { queriesPreviewWiring } from './wiring'

/**
 * QueriesPreview {@link XModule} alias.
 *
 * @public
 */
export type QueriesPreviewXModule = XModule<QueriesPreviewXStoreModule>

/**
 * QueriesPreview {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `queries-preview` entry point.
 *
 * @public
 */
export const queriesPreviewXModule: QueriesPreviewXModule = {
  name: 'queriesPreview',
  storeModule: queriesPreviewXStoreModule,
  storeEmitters: queriesPreviewEmitters,
  wiring: queriesPreviewWiring,
}

XPlugin.registerXModule(queriesPreviewXModule)
