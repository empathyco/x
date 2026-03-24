import type { XModule } from '../x-modules.types'
import type { AiXStoreModule } from './store/types'
import { XPlugin } from '../../plugins'
import { aiEmitters } from './store/emitters'
import { aiXStoreModule } from './store/module'
import { aiWiring } from './wiring'

/**
 * Ai {@link XModule} alias.
 *
 * @public
 */
export type AiXModule = XModule<AiXStoreModule>

/**
 * AI {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `AI` entry point.
 *
 * @public
 */
export const aiXModule: AiXModule = {
  name: 'ai',
  storeModule: aiXStoreModule,
  storeEmitters: aiEmitters,
  wiring: aiWiring,
}

XPlugin.registerXModule(aiXModule)
