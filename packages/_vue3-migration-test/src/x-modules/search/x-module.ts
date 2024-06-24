import { PrivateXModuleOptions } from '../../../../x-components/src/plugins';
import { SearchXModule } from '../../../../x-components/src/x-modules/search';

export const searchXModule = {
  storeModule: {
    state: {
      results: [],
      promoteds: [],
      banners: [],
      status: 'initial',
      spellcheckedQuery: '',
      partialResults: []
    }
  }
} as PrivateXModuleOptions<SearchXModule>;
