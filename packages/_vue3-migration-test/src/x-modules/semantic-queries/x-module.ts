import { PrivateXModuleOptions } from '../../../../x-components/src/plugins/x-plugin.types';
import { SemanticQueriesXModule } from '../../../../x-components/src/x-modules/semantic-queries/x-module';

export const semanticQueriesXModule: PrivateXModuleOptions<SemanticQueriesXModule> = {
  storeModule: {
    state: {
      config: {
        threshold: 5,
        maxItemsToRequest: 3
      },
      semanticQueries: [{ query: 'test', distance: 0 }],
      params: {},
      query: 'jeans',
      totalResults: 2
    }
  }
};
