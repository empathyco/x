import { SearchRequest } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { QueryPreviewInfo } from './store/index';

/**
 * Dictionary of the events of QueriesPreview XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface QueriesPreviewXEvents {
  /**
   * Any property of cacheable queries preview request has changed.
   * Payload: The new {@link @empathyco/x-types#SearchRequest | request}.
   */
  QueryPreviewRequestUpdated: SearchRequest;
  /**
   * User has clicked on a query preview.
   * Payload: The {@link QueryPreviewInfo | query preview info}
   * of the selected {@link QueryPreviewItem | item}.
   */
  UserAcceptedAQueryPreview: QueryPreviewInfo;
  /**
   * The query preview has been unselected.
   * Payload: The extra params to be restored in the modules affected by the
   * query preview selection.
   */
  QueryPreviewUnselected: Dictionary<unknown>;
  /**
   * The query preview has been mounted.
   * Payload: The query preview query as a key converted into a unique id (query hash).
   * When QueryPreviewMounted is emitted, the instances count is increased.
   */
  QueryPreviewMounted: string;
  /**
   * The query preview has been unmounted.
   * Payload: The query preview's unique id (query hash) and its cache value.
   * When QueryPreviewUnmounted is emitted, the instance count for that query hash
   * will be decreased. If the cache is set to false, the query will be removed
   * safely from the state since there will be no component showing that data.
   */
  QueryPreviewUnmounted: { query: string; cache: boolean };
}
