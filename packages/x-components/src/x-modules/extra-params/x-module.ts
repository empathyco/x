import type { XModule } from '../x-modules.types'
import type { ExtraParamsXStoreModule } from './store/types'
import { XPlugin } from '../../plugins/index'
import { extraParamsEmitters } from './store/emitters'
import { extraParamsXStoreModule } from './store/module'
import { extraParamsWiring } from './wiring'

/**
 * ExtraParams {@link XModule} alias.
 *
 * @public
 */
export type ExtraParamsXModule = XModule<ExtraParamsXStoreModule>

/**
 * ExtraParams {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `extraParams` entry point.
 *
 * @public
 */
export const extraParamsXModule: ExtraParamsXModule = {
  name: 'extraParams',
  storeModule: extraParamsXStoreModule,
  storeEmitters: extraParamsEmitters,
  wiring: extraParamsWiring,
}

XPlugin.registerXModule(extraParamsXModule)
