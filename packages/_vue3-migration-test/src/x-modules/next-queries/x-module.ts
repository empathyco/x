import { getNextQueriesStub } from '../../../../x-components/src/__stubs__/next-queries-stubs.factory';
import { PrivateXModuleOptions } from '../../../../x-components/src/plugins';
import { NextQueriesXModule } from '../../../../x-components/src/x-modules/next-queries';

export const nextQueriesXModule = {
  storeModule: {
    state: {
      query: 'dress',
      nextQueries: getNextQueriesStub(),
      status: 'success'
    }
  }
} as PrivateXModuleOptions<NextQueriesXModule>;
