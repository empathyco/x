import { createStoreEmitters } from '../../../store';
import { searchBoxXStoreModule } from './module';

export const searchBoxEmitters = createStoreEmitters(searchBoxXStoreModule, {
  SearchBoxQueryChanged: (state, getters) => getters.trimmedQuery
});
