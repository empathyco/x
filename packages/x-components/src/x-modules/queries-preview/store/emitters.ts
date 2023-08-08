import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  SearchRequestUpdated: (_, getters) => (getters.request?.query ? getters.request : null),
  SetQueryPreviewQuery: (_, getters) => (getters.request ? getters.request.query : '')
});
