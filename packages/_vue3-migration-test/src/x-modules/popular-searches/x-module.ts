import { PopularSearchesXModule } from '../../../../x-components/src/x-modules/popular-searches/x-module';
import { PrivateXModuleOptions } from '../../../../x-components/src/plugins';
import { createPopularSearch } from '../../../../x-components/src/__stubs__/popular-searches-stubs.factory';

export const popularSearchesXModule: PrivateXModuleOptions<PopularSearchesXModule> = {
  storeModule: {
    state: {
      popularSearches: ['patata', 'salchicón', 'pan', 'queso', 'leche', 'galletas'].map(query =>
        createPopularSearch(query)
      ),
      config: {
        hideSessionQueries: false
      }
    }
  }
};
