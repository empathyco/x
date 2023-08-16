import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  SetQueryPreviewParams: (_, getters) =>
    getters.selectedQueryPreview?.extraParams
      ? getters.selectedQueryPreview.extraParams
      : getters.initialParams,
  UserAcceptedAQuery: (_, getters) =>
    getters.selectedQueryPreview?.query ? getters.selectedQueryPreview.query : ''
});
