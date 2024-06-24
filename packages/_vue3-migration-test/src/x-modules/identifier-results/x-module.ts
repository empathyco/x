import { PrivateXModuleOptions } from '../../../../x-components/src/plugins/x-plugin.types';
import { IdentifierResultsXModule } from '../../../../x-components/src/x-modules/identifier-results/x-module';

export const identifierResultsXModule: PrivateXModuleOptions<IdentifierResultsXModule> = {
  storeModule: {
    state: {
      config: {
        debounceInMs: 600,
        maxItemsToRequest: 10,
        identifierDetectionRegexp: '^[0-9]{2,}$',
        separatorChars: '-/ '
      },
      identifierResults: [],
      origin: null,
      query: 'test',
      params: {},
      status: 'initial'
    }
  }
};
