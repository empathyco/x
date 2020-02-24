import { createStoreEmitters } from '../../../store';
import { nextQueriesXStoreModule } from './module';

export const nextQueriesEmitters = createStoreEmitters(nextQueriesXStoreModule, {
  NextQueriesRequestChanged: (state, getters) => getters.request
});
