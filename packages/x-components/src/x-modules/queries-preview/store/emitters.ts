import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  SetQueryPreviewParams: (_, getters) =>
    getters.selectedQueryPreview?.extraParams?.scope
      ? getters.selectedQueryPreview.extraParams
      : getters.initialParams,
  SetQueryPreviewQuery: (_, getters) =>
    getters.selectedQueryPreview?.query ? getters.selectedQueryPreview.query : ''
});
