import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  // Este solo para los initial
  SetQueryPreviewParams: {
    selector: state => state.selectedQueryPreview.extraParams!
  }

  //UserAcceptedAQuery: (_, getters) =>
  //  getters.selectedQueryPreview?.query ? getters.selectedQueryPreview.query : ''
});
