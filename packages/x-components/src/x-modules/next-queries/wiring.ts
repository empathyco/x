import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

const nextQueriesModule = withModule('nextQueries');

const setNextQueriesQuery = nextQueriesModule.wireCommit('setQuery');
const retrieveNextQueries = nextQueriesModule.wireDispatchWithoutPayload('retrieveNextQueries');

export const nextQueriesWiring = createWiring({
  UserSelectedAQuery: {
    setNextQueriesQuery
  },
  NextQueriesRequestChanged: {
    retrieveNextQueries
  }
});
