import type { Browse, BrowseRequest, Sort, TaggingRequest } from '@empathyco/x-types'
import type { InternalBrowseResponse } from './store/types'

/**
 * Dictionary of the events of Browse XModule, where each key is the event name,
 * and the value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface BrowseXEvents {
  /**
   * Any property of the browse request has changed
   * Payload: The new browse request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  BrowseRequestChanged: BrowseRequest | null
  /**
   * Selected Related Prompt has been changed.
   * Payload: Selected Related Prompt index. -1 is deselected.
   */
  UserBrowsedToCategory: Browse
  /**
   * The user has clicked out of the browse view.
   */
  UserClickedOutOfBrowse: void
  /**
   * The selected sort in the current browse experience.
   * Payload: The sort option selected.
   */
  SelectedBrowseSortProvided: Sort
  /**
   * The user has clicked one sort option in the browse experience.
   * Payload: The sort option clicked.
   */
  UserClickedABrowseSort: Sort
  /**
   * Query tagging has been changed.
   * Payload: The new query tagging object.
   */
  BrowseTaggingChanged: TaggingRequest
  /**
   * A browse response has been provided.
   * Payload: The provided internal response object.
   */
  BrowseResponseChanged: InternalBrowseResponse
}
