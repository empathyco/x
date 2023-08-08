import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  SearchRequestUpdated: (_, getters) => getters.request,
  SetQueryPreviewQuery: (_, getters) => (getters.request ? getters.request.query : '')
});
