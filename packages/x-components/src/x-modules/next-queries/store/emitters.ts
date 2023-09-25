import { createStoreEmitters } from '../../../store';
import { createEmitterArrayFilter } from '../../../utils/array';
import { nextQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the next-queries module.
 *
 * @internal
 */
export const nextQueriesEmitters = createStoreEmitters(nextQueriesXStoreModule, {
  NextQueriesChanged: {
    selector: (_, getters) => getters.nextQueries,
    filter: createEmitterArrayFilter('query')
  },
  NextQueriesRequestUpdated: (_, getters) => getters.request
});
