import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

const termSuggestionsModule = withModule('termSuggestions');

const setTermSuggestionsQuery = termSuggestionsModule.wireCommit('setQuery');
const retrieveTermSuggestions = termSuggestionsModule.wireDispatchWithoutPayload(
  'retrieveSuggestions'
);

export const termSuggestionsWiring = createWiring({
  UserIsChangingQuery: {
    setTermSuggestionsQuery // TODO It should be debounced
  },
  UserSelectedAQuery: {
    setTermSuggestionsQuery
  },
  TermSuggestionsRequestChanged: {
    retrieveTermSuggestions
  }
});
