import { createStoreEmitters } from '../../../store';
import { nextQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} for the next-queries module
 * @internal
 */
export const nextQueriesEmitters = createStoreEmitters(nextQueriesXStoreModule, {
  NextQueriesRequestChanged: (state, getters) => getters.request
});
