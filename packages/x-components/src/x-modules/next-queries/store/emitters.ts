import { createStoreEmitters } from '../../../store';
import { nextQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the next-queries module.
 *
 * @internal
 */
export const nextQueriesEmitters = createStoreEmitters(nextQueriesXStoreModule, {
  NextQueriesRequestChanged: (_, getters) => getters.request
});
