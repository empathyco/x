import { createStoreEmitters } from '../../../store';
import { recommendationsXStoreModule } from './module';
/**
 * {@link StoreEmitters} For the recommendations module.
 *
 * @internal
 */
export const recommendationsEmitters = createStoreEmitters(recommendationsXStoreModule, {
  RecommendationsChanged: state => state.recommendations,
  RecommendationsRequestChanged: {
    selector: (_, getters) => getters.request,
    immediate: true
  }
});
