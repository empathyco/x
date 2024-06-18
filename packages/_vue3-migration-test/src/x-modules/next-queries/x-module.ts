import { PrivateXModuleOptions } from '../../../../x-components/src/plugins';
import { NextQueriesXModule } from '../../../../x-components/src/x-modules/next-queries';

export const nextQueriesXModule = {
  storeModule: {
    state: {
      config: {
        hideSessionQueries: false
      }
    }
  }
} as PrivateXModuleOptions<NextQueriesXModule>;
