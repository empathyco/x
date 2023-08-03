import { SearchRequest } from '@empathyco/x-types';
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
   * User accepted a QueryPreview.
   * Payload: The {@link QueryPreviewInfo | query preview} selected.
   */
  UserAcceptedAQueryPreview: QueryPreviewInfo;
}
