import { createStoreEmitters } from '../../../store';
import { nextQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the next-queries module.
 *
 * @internal
 */
export const nextQueriesEmitters = createStoreEmitters(nextQueriesXStoreModule, {
  NextQueriesChanged: state => state.nextQueries,
  NextQueriesRequestChanged: (_, getters) => getters.request
});
