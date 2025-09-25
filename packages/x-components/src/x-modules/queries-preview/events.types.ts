import type { SearchRequest } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { QueryPreviewInfo, QueryPreviewItem } from './store'

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
  QueryPreviewRequestUpdated: SearchRequest
  /**
   * User has clicked on a query preview.
   * Payload: The {@link QueryPreviewInfo | query preview info}
   * of the selected {@link QueryPreviewItem | item}.
   */
  UserAcceptedAQueryPreview: QueryPreviewInfo
  /**
   * The query preview has been unselected.
   * Payload: The extra params to be restored in the modules affected by the
   * query preview selection.
   */
  QueryPreviewUnselected: Dictionary<unknown>
  /**
   * The query preview has been mounted.
   * Payload: The query preview query as a key converted into a unique id (query hash).
   */
  QueryPreviewMounted: string
  /**
   * The query preview has been unmounted.
   * Payload: The query preview's unique id (query hash) and its cache value.
   */
  QueryPreviewUnmounted: { queryPreviewHash: string; cache: boolean }
  /**
   * The query preview has been changed.
   * Payload: The query preview item.
   */
  QueriesPreviewChanged: Dictionary<QueryPreviewItem>
}
