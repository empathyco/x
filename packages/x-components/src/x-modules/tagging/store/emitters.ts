import { createStoreEmitters } from '../../../store/utils/store-emitters.utils';
import { taggingXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the tagging module.
 *
 * @internal
 */
export const taggingEmitters = createStoreEmitters(taggingXStoreModule, {
  ConsentChanged: state => state.consent!,
  SearchTaggingReceived: state => state.queryTaggingInfo!,
  ResultURLTrackingEnabled: {
    selector: state => state.config.clickedResultStorageKey,
    filter: newValue => newValue === 'url'
  }
});
