import { createStoreEmitters } from '../../../store';
import { querySuggestionsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the query-suggestions module.
 *
 * @internal
 */
export const querySuggestionsEmitters = createStoreEmitters(querySuggestionsXStoreModule, {
  QuerySuggestionsChanged: state => state.suggestions,
  QuerySuggestionsRequestChanged: (_, getters) => getters.request
});
