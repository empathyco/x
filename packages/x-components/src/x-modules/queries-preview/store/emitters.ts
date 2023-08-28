import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';
import { isEmpty } from 'rxjs';
import { areFiltersDifferent } from '../../../utils';
import { Filter } from '@empathyco/x-types';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  // Emit QueryPreviewDeselected when queryPreviewSelected is empty
  SelectedQueryPreviewChanged: {
    selector: (state) => !state.selectedQueryPreview ? state.params : state.selectedQueryPreview.extraParams!,
    filter: (newValue, oldValue, state) => {
      console.log('filtering', !state.selectedQueryPreview);
      return !state.selectedQueryPreview;
    }
  }
});
