import { createStoreEmitters } from '../../../store';
import { termSuggestionsXStoreModule } from './module';

export const termSuggestionsEmitters = createStoreEmitters(termSuggestionsXStoreModule, {
  TermSuggestionsRequestChanged: (state, getters) => getters.request
});
