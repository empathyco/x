import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  SelectedQueryPreviewChanged: {
    selector: state =>
      !state.selectedQueryPreview ? state.params : state.selectedQueryPreview.extraParams!,
    filter: (newValue, oldValue, state) => !state.selectedQueryPreview
  }
});
