import { PrivateXModuleOptions } from '../../../../x-components/src/plugins/x-plugin.types';
import { SemanticQueriesXModule } from '../../../../x-components/src/x-modules/semantic-queries/x-module';
import { QueriesPreviewXModule } from '../../../../x-components/src/x-modules/queries-preview/x-module';
import { getResultsStub } from '../../../../x-components/src/__stubs__/results-stubs.factory';

export const semanticQueriesXModule: PrivateXModuleOptions<SemanticQueriesXModule> = {
  storeModule: {
    state: {
      config: {
        threshold: 5,
        maxItemsToRequest: 3
      },
      semanticQueries: [{ query: 'prueba', distance: 0 }],
      params: {},
      query: 'jeans',
      totalResults: 2
    }
  }
};

export const queriesPreviewXModule: PrivateXModuleOptions<QueriesPreviewXModule> = {
  storeModule: {
    state: {
      queriesPreview: {
        c893bad68927b457dbed39460e6afd62: {
          request: {
            query: 'prueba'
          },
          results: getResultsStub(4),
          status: 'success',
          instances: 1,
          totalResults: 100
        }
      }
    }
  }
};
