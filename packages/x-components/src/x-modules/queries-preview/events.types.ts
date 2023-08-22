import { SearchRequest } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { QueryPreviewInfo } from '../../x-installer/index';

/**
 * Dictionary of the events of QueriesPreview XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface QueriesPreviewXEvents {
  /**
   * Any property of the queries preview request has changed.
   * Payload: The new {@link @empathyco/x-types#SearchRequest | request}.
   */
  QueryPreviewRequestUpdated: SearchRequest;
  /**
   * The component that shows a Query preview has been unmounted.
   * Payload: The query whose preview has been removed.
   */
  QueryPreviewUnmountedHook: string;
  /**
   * User has clicked on a query preview.
   * Payload: The {@link QueryPreviewInfo | query preview info}
   * of the selected {@link QueryPreviewItem | item}.
   */
  UserAcceptedAQueryPreview: QueryPreviewInfo;
  /**
   * The selected query preview has changed.
   * Payload: The new selected query preview extra params or the initial module
   * params if the query has been cleared.
   */
  SelectedQueryPreviewParamsChanged: Dictionary<unknown>;
}
