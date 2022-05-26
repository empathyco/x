import { createStoreEmitters } from '../../../store/utils/store-emitters.utils';
import { popularSearchesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the popular-searches module.
 *
 * @internal
 */
export const popularSearchesEmitters = createStoreEmitters(popularSearchesXStoreModule, {
  PopularSearchesRequestChanged: {
    selector: (_, getters) => getters.request
  }
});
