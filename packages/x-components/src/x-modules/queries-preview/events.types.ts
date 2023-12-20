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
   * Any property of no cacheable queries preview request has changed.
   * Payload: The new {@link @empathyco/x-types#SearchRequest | request}.
   */
  QueryPreviewRequestUpdatedForNoCache: SearchRequest;
  /**
   * The component that shows a Query preview has been unmounted.
   * Payload: The query whose preview has been removed.
   */
  NonCacheableQueryPreviewUnmounted: string;
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
}
