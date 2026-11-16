import type { ExtraParamsXStoreModule } from './types'

/**
 * {@link XStoreModule} For the ExtraParams module.
 *
 * @internal
 */
export const extraParamsXStoreModule: ExtraParamsXStoreModule = {
  state: () => ({
    params: {},
    catalogSectionParamKey: 'catalogSection',
  }),
  getters: {},
  mutations: {
    setParams(state, params) {
      state.params = { ...state.params, ...params }
    },
  },
  actions: {},
}
