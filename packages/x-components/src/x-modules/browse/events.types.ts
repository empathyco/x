import type { BrowsableRequest, Sort, TaggingRequest } from '@empathyco/x-types'
import type { InternalBrowseRequest, InternalBrowseResponse } from './types'

/**
 * Dictionary of the events of Browse XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface BrowseXEvents {
  /**
   * Any property of the browse request has changed.
   * Payload: The new browse request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  BrowseRequestChanged: InternalBrowseRequest | null
  /**
   * Any property of the browse request has been updated.
   * Payload: The new browse request or `null` if there is not enough data in the state to
   * conform a valid request.
   *
   * @remarks The difference from `BrowseRequestChanged` and this event is this one will be executed
   * with more priority (As it is not a `...Changed` event). So we can use this event to modify
   * request params before emitting the `BrowseRequestChanged` and fetch the API.
   */
  BrowseRequestUpdated: InternalBrowseRequest | null
  /**
   * A browse response has been provided.
   * Payload: The provided internal response object.
   */
  BrowseResponseChanged: InternalBrowseResponse
  /**
   * Browse tagging has been changed.
   * Payload: The new browse tagging object.
   */
  BrowseTaggingChanged: TaggingRequest
  /**
   * The user has clicked one of the sorts.
   * Payload: The sort option that the user has selected.
   */
  UserClickedABrowseSort: Sort
  /**
   * A new selected sort has been provided.
   * Payload: The sort option that has been provided.
   *
   * @remarks This event is used when the user of the library wants to provide their own selected
   * sort value.
   */
  SelectedBrowseSortProvided: Sort
  /**
   * The user has selected a browse category.
   * Payload: The browse category fields needed for the request.
   */
  UserBrowsedToCategory: BrowsableRequest
}
