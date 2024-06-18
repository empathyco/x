import { PrivateXModuleOptions } from '../../../../x-components/src/plugins/x-plugin.types';
import { IdentifierResultsXModule } from '../../../../x-components/src/x-modules/identifier-results/x-module';
import { createResultStub } from '../../../../x-components/src/__stubs__/results-stubs.factory';

export const identifierResultsXModule: PrivateXModuleOptions<IdentifierResultsXModule> = {
  storeModule: {
    state: {
      config: {
        debounceInMs: 600,
        maxItemsToRequest: 10,
        identifierDetectionRegexp: '^[0-9]{2,}$',
        separatorChars: '-/ '
      },
      identifierResults: ['123A', '123B', '123C', '123D'].map(id => createResultStub(id)),
      origin: null,
      query: 'test',
      params: {},
      status: 'initial'
    }
  }
};
