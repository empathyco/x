import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

const searchBoxModule = withModule('searchBox');

const setSearchBoxQuery = searchBoxModule.wireCommit('setQuery');

export const searchBoxWiring = createWiring({
  UserIsChangingQuery: {
    setSearchBoxQuery
  },
  UserSelectedAQuery: {
    setSearchBoxQuery
  },
  UserPressedEnter: {
    setSearchBoxQuery
  }
});
