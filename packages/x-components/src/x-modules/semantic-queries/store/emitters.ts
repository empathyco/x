import { createStoreEmitters } from '../../../store/utils/store-emitters.utils';
import { semanticQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the semantic-queries module.
 *
 * @internal
 */
export const semanticQueriesEmitters = createStoreEmitters(semanticQueriesXStoreModule, {
  SemanticQueryRequestUpdated: (_, getters) => getters.request
});
