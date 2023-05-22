import { createStoreEmitters } from '../../../store/index';
import { semanticQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const semanticQueriesEmitters = createStoreEmitters(semanticQueriesXStoreModule, {});
