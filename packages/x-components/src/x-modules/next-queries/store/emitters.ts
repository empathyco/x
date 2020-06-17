import { createStoreEmitters } from '../../../store';
import { areNextQueriesDifferent } from '../utils';
import { nextQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the next-queries module.
 *
 * @internal
 */
export const nextQueriesEmitters = createStoreEmitters(nextQueriesXStoreModule, {
  NextQueriesChanged: {
    selector: (_, getters) => getters.nextQueries,
    isDifferent: areNextQueriesDifferent
  },
  NextQueriesRequestChanged: (_, getters) => getters.request
});
