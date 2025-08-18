import type { ConfigMutations, XStoreModule } from '../../../store'
import type { AiConfig } from '../config.types'

/** AI store state. */
export interface AiState {
  /* The config of the `AI` module. */
  config: AiConfig
}

/** AI store getters. */
export interface AiGetters {}

/** AI store mutations. */
export interface AiMutations extends ConfigMutations<AiState> {}

/** AI store actions. */
export interface AiActions {}

/** AI type safe store module.*/
export type AiXStoreModule = XStoreModule<AiState, AiGetters, AiMutations, AiActions>
