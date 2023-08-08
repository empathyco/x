import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  SearchRequestUpdated: (_, getters) => getters.request
  // Should we emit SearchRequestChanged here and pick the info from the queriesPreview state??
});
