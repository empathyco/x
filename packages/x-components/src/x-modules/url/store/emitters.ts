import { createStoreEmitters } from '../../../store';
import { urlXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the URL module.
 *
 * @internal
 */
export const urlEmitters = createStoreEmitters(urlXStoreModule, {
  UrlStateChanged: (_, getters) => getters.urlParams,
  UrlChanged: {
    selector: (_, getters) => getters.urlParams,
    filter: urlParams => urlParams.isLoadedFromUrl as boolean
  }
});
