/**
 * {@link XStoreModule} For the empathize module.
 *
 * @internal
 */
export const experienceControlsXStoreModule: any = {
  state: () => ({
    config: {
      numberOfCarousels: 5,
      resultsPerCarousels: 12
    }
  }),
  getters: {
    getNumberCarousels(state: any) {
      return state.config.numberOfCarousels;
    },
    getResultsCarousels(state: any) {
      return state.config.resultsPerCarousels;
    }
  },
  mutations: {
    setExperienceControlsConfig(state: any, experienceControlsConfig: any) {
      Object.assign(state.config, experienceControlsConfig);
    }
  },
  actions: {}
};
