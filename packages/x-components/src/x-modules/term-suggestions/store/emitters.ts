import { createStoreEmitters } from '../../../store';
import { termSuggestionsXStoreModule } from './module';

/**
 * {@link StoreEmitters} for the term-suggestions module
 * @internal
 */
export const termSuggestionsEmitters = createStoreEmitters(termSuggestionsXStoreModule, {
  TermSuggestionsRequestChanged: (_, getters) => getters.request
});
