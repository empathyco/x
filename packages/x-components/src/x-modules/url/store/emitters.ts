import { createStoreEmitters } from '../../../store';
import { urlXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the URL module.
 *
 * @internal
 */
export const urlEmitters = createStoreEmitters(urlXStoreModule, {
  UrlParamsChanged: (_, getters) => getters.urlParams
});
