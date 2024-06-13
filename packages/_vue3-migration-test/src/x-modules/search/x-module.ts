import { getResultsStub } from '../../../../x-components/src/__stubs__/results-stubs.factory';
import { getBannersStub } from '../../../../x-components/src/__stubs__/banners-stubs.factory';
import { getPromotedsStub } from '../../../../x-components/src/__stubs__/promoteds-stubs.factory';
import { PrivateXModuleOptions } from '../../../../x-components/src/plugins';
import { SearchXModule } from '../../../../x-components/src/x-modules/search';
import { getPartialResultsStub } from '../../../../x-components/src/__stubs__/partials-results-stubs.factory';

export const searchXModule = {
  storeModule: {
    state: {
      results: getResultsStub(10),
      promoteds: getPromotedsStub(),
      banners: getBannersStub(),
      status: 'success',
      spellcheckedQuery: 'spellcheckedQuery',
      partialResults: getPartialResultsStub()
    }
  }
} as PrivateXModuleOptions<SearchXModule>;
