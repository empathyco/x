import { createStoreEmitters } from '../../../store';
import { createArrayComparator } from '../../../utils/array';
import { nextQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the next-queries module.
 *
 * @internal
 */
export const nextQueriesEmitters = createStoreEmitters(nextQueriesXStoreModule, {
  NextQueriesChanged: {
    selector: (_, getters) => getters.nextQueries,
    filter: createArrayComparator('query')
  },
  NextQueriesRequestChanged: (_, getters) => getters.request
});
