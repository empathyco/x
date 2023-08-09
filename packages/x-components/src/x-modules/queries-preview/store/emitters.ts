import { createStoreEmitters } from '../../../store';
import { queriesPreviewXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the queries-preview module.
 *
 * @internal
 */
export const queriesPreviewEmitters = createStoreEmitters(queriesPreviewXStoreModule, {
  SetQueryPreviewParams: (_, getters) =>
    getters.request?.extraParams?.scope ? getters.request.extraParams : getters.initialParams,
  SetQueryPreviewQuery: (_, getters) => (getters.request?.query ? getters.request.query : '')
});
