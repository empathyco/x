export const xcontrolsStoreModule: any = {
  state: () => ({
    numberOfCarousels: 5,
    resultsPerCarousels: 12
  }),
  getters: {
    getNumberCarousels(state: any) {
      return state.numberOfCarousels;
    },
    getResultsCarousels(state: any) {
      return state.resultsPerCarousels;
    }
  },
  mutations: {
    setNumberCarousels(state: any, numberOfCarousels: number) {
      state.numberOfCarousels = { ...state.numberOfCarousels, numberOfCarousels };
    },
    setResultsCarousels(state: any, resultsPerCarousels: number) {
      state.resultsPerCarousels = { ...state.resultsPerCarousels, resultsPerCarousels };
    }
  },
  actions: {}
};
