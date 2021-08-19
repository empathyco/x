import { createStoreEmitters } from '../../../store';
import { extraParamsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the {@link ExtraParamsXModule}.
 *
 * @internal
 */
export const extraParamsEmitters = createStoreEmitters(extraParamsXStoreModule, {
  ExtraRequestParamsChanged: state => state.params
});
