import { createStoreEmitters } from '../../../store';
import { urlXStoreModule } from './module';
import { UrlXEvents } from '../events.types';

/**
 * {@link StoreEmitters} For the URL module.
 *
 * @internal
 */
export const urlEmitters = createStoreEmitters(urlXStoreModule, {
  UrlStateChanged: (_, getters) => getters.urlParams
});
