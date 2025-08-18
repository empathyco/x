import type { AiXStoreModule } from './types'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'

/* {@link XStoreModule} For the AI module. */
export const aiXStoreModule: AiXStoreModule = {
  state: () => ({
    config: {},
  }),
  getters: {},
  mutations: {
    setConfig,
    mergeConfig,
  },
  actions: {},
}
