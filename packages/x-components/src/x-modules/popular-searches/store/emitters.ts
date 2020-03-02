import { createStoreEmitters } from '../../../store/store.utils';
import { popularSearchesXStoreModule } from './module';

export const popularSearchesEmitters = createStoreEmitters(popularSearchesXStoreModule, {
  PopularSearchesRequestChanged: {
    selector: (_, getters) => getters.request,
    immediate: true
  }
});
