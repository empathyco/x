import { createStoreEmitters } from '../../../store/store.utils';
import { popularSearchesXStoreModule } from './module';

export const popularSearchesEmitters = createStoreEmitters(popularSearchesXStoreModule, {
  PopularSearchesRequestChanged: (_, getters) => getters.request
});
