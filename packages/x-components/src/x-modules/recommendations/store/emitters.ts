import { createStoreEmitters } from '../../../store';
import { recommendationsXStoreModule } from './module';
/**
 * {@link StoreEmitters} For the recommendations module.
 *
 * @internal
 */
export const recommendationsEmitters = createStoreEmitters(recommendationsXStoreModule, {
  RecommendationsRequestChanged: {
    selector: (_, getters) => getters.request
  }
});
