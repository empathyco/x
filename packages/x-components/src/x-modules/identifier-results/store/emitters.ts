import { createStoreEmitters } from '../../../store';
import { identifierResultsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the identifier-results module.
 *
 * @internal
 */
export const identifierResultsEmitters = createStoreEmitters(identifierResultsXStoreModule, {
  IdentifierResultsChanged: state => state.identifierResults,
  IdentifierResultsRequestChanged: (_, getters) => getters.request
});
