import { createStoreEmitters } from '../../../store';
import { createArrayComparator } from '../../../utils/array';
import { identifierResultsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the identifier-results module.
 *
 * @internal
 */
export const identifierResultsEmitters = createStoreEmitters(identifierResultsXStoreModule, {
  IdentifierResultsChanged: {
    selector: state => state.identifierResults,
    filter: createArrayComparator('id')
  },
  IdentifierResultsRequestChanged: (_, getters) => getters.identifierResultsRequest
});
